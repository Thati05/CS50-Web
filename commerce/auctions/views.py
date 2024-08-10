from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse

from .models import User, CreateListing, ListDetails
from .forms import AuctionListingForm



def index(request):
    lists = CreateListing.objects.all()
    context = {'lists': lists}
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


def create_listings(request):
    form = AuctionListingForm()
    if request.method == 'POST':
        form = AuctionListingForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse("index"))
    context = {'form':form}
    return render(request, 'auctions/create-list.html', context)

 


def details_listing(request, auction_id):
    listing = get_object_or_404(CreateListing, id=auction_id)
    if request.method == 'POST':
        bid_amount = request.POST.get("bid")
        comment = request.POST.get("comment")
        user = request.user
        
        # Ensure the user is authenticated
        if not user.is_authenticated:
            return HttpResponseRedirect(reverse("login"))

        ListDetails.objects.create(list_details=listing, bid=bid_amount, user=user, comment=comment)
        return HttpResponseRedirect(reverse("listing", args=[auction_id]))

    else:
        list_details = ListDetails.objects.filter(list_details=listing)
        bid_count = list_details.count()
        return render(request, "auctions/auction_details.html", {
            "listing": listing,
            "list_details": list_details,
            "bid_count": bid_count
        })

def my_listings(request):
    '''should show listings created by user, allow the user to view the listing, view all comment made close actuion and display the highest
    bider '''