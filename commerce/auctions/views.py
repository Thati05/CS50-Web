from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse

from .models import *
from .forms import AuctionListingForm



def index(request):
    lists = CreateListing.objects.all()
    user = request.user
    context = {
        'lists': lists,

    }
    return render(request, 'auctions/index.html', context)




def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

@login_required
def create_listings(request):
    if request.method == 'POST':
        form = AuctionListingForm(request.POST)
        if form.is_valid():
            listing = form.save(commit=False)  # Don't save to the database yet
            listing.user = request.user  # Set the user field to the current user
            listing.save()  # Now save the listing
            return redirect('index')
    else:
        form = AuctionListingForm()

    context = {'form': form}
    return render(request, 'auctions/create-list.html', context)

 

def details_listing(request, auction_id):
    listing = get_object_or_404(CreateListing, id=auction_id)

    
    if request.method == 'POST':
        bid_amount = request.POST.get("bid")
        comment_body = request.POST.get("comment")
        
        # Ensure the user is authenticated
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse("login"))

        if bid_amount:
            ListDetails.objects.create(list_details=listing, bid=bid_amount, user=request.user)
        
        if comment_body:
            Comment.objects.create(listing=listing, user=request.user, body=comment_body)
        
        return HttpResponseRedirect(reverse("listing", args=[auction_id]))

    else:
        list_details = ListDetails.objects.filter(list_details=listing)
        comments = Comment.objects.filter(listing=listing)
        bid_count = list_details.count()
         # Check if the auction is closed
        is_closed = listing.my_listings.first().close_auction if listing.my_listings.exists() else False

        return render(request, "auctions/auction_details.html", {
            "listing": listing,
            "list_details": list_details,
            "bid_count": bid_count,
            "creator": listing.user,
            "comments": comments,
            "is_closed": is_closed,  # Pass the closed status to the template
        })






def my_listings(request):
    user = request.user
    # Filter listings created by the user that are not closed
    user_listings = CreateListing.objects.filter(user=user).exclude(my_listings__close_auction=True)
    
    
    # Check if the user has won any bids
    won_auctions = []
    if user.is_authenticated:
        won_auctions = MyListing.objects.filter(highest_bidder=user, close_auction=True)

    # Process the listings to include the highest bid for each listing
    for listing in user_listings:
        highest_bid = listing.list_details.order_by('-bid').first()
        listing.highest_bid = highest_bid.bid if highest_bid else None
        listing.highest_bidder = highest_bid.user if highest_bid else None

    if request.method == 'POST':
        listing_id = request.POST.get('listing_id')
        # Retrieve the CreateListing object first
        listing = get_object_or_404(CreateListing, id=listing_id, user=user)
        # Find or create the corresponding MyListing object
        my_listing, created = MyListing.objects.get_or_create(user_listing=listing)
        my_listing.close_listing()
        return redirect('my-listings')


    return render(request, 'auctions/my_listing.html', {
        'user_listings': user_listings,
        'won_auctions': won_auctions,
    })
    

def watchlist(request):
    user = request.user

    if request.method == 'POST':
        listing_id = request.POST.get('listing_id')
        listing = get_object_or_404(CreateListing, id=listing_id)


        if 'remove' in request.POST:
            # Remove the listing from the watchlist
            watchlist_item = get_object_or_404(WatchList, user=user, listing=listing)
            watchlist_item.remove_list()  # Mark the item as removed
          
        else:
            # Add the listing to the watchlist if not already present
            WatchList.objects.get_or_create(user=user, listing=listing, remove_watchlist=False)

        return redirect('watchlist')

    # Get the user's active watchlist items (not removed)
    user_watchlist = WatchList.objects.filter(user=user, remove_watchlist=False)

    return render(request, 'auctions/watchlist.html', {
        "user_watchlist": user_watchlist
    })

  # function must display the category that the user has choosen, example: Fashion 
def category(request, category):
    # Get all listings that belong to the chosen category
    listings = CreateListing.objects.filter(category=category)

    
    return render(request, 'auctions/category_listings.html', {
        'category': category,
        'listings': listings
    })


         # function must show the avaliable categories that the user can choose from
def categories(request):
    categories_with_images = {
        'Fashion': 'https://cdn-icons-png.flaticon.com/128/1124/1124043.png',
        'Skincare': 'https://cdn-icons-png.flaticon.com/128/2413/2413171.png',
        'Art & Crafts': 'https://cdn-icons-png.flaticon.com/128/2722/2722226.png',
        'No category': 'https://cdn-icons-png.flaticon.com/128/6662/6662930.png',
        'Home & Kitchen': 'https://cdn-icons-png.flaticon.com/128/11495/11495820.png',
        'Jewelry & Accessories': 'https://cdn-icons-png.flaticon.com/128/1426/1426087.png',
        'Electronics': 'https://cdn-icons-png.flaticon.com/128/2777/2777142.png'
    }

    return render(request, 'auctions/categories.html', {
        'categories_with_images': categories_with_images,
    })

    from django.http import Http404

def test_404_view(request):
    raise Http404("This is a test 404 error")