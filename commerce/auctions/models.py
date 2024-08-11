from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinLengthValidator

class User(AbstractUser):
    pass

class CreateListing(models.Model):
    CATEGORY_CHOICES = [
        ('Fashion', 'Fashion'),
        ('Art & Crafts', 'Art & Crafts'),
        ('Electronics', 'Electronics'),
        ('Skincare', 'Skincare')
    ]

    title = models.CharField(max_length=64, validators=[MinLengthValidator(40)])
    image_url = models.URLField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, default="No category", choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=300, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title




class ListDetails(models.Model):
    list_details = models.ForeignKey(CreateListing, on_delete=models.CASCADE, related_name="list_details")
    bid = models.DecimalField(max_digits=20, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
   

    def __str__(self):
        return f"{self.list_details.title} - Bid by {self.user.username}"

class MyListing(models.Model):
    user_listing = models.ForeignKey(CreateListing, on_delete=models.CASCADE, related_name="my_listings")
    close_auction = models.BooleanField(default=False)  # To check if the auction is closed
    highest_bidder = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)  # Winner of the auction

    def close_listing(self):
        """Close the auction and set the highest bidder."""
        self.close_auction = True
        highest_bid = self.user_listing.list_details.order_by('-bid').first()
        if highest_bid:
            self.highest_bidder = highest_bid.user
        self.save()

    def __str__(self):
        return f"{self.user_listing.title} - Auction closed: {self.close_auction}"
        

class WatchList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watchlists")
    listing = models.ForeignKey(CreateListing, on_delete=models.CASCADE, related_name="watchlists")
    remove_watchlist = models.BooleanField(default=False)

    def remove_list(self):
        self.remove_watchlist = True
        self.save()

    def __str__(self):
        return f"{self.listing.title} - Removed: {self.remove_watchlist}"


  


class Comment(models.Model):
    listing = models.ForeignKey(CreateListing, on_delete=models.CASCADE, related_name='comments', default=None)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.body}"



