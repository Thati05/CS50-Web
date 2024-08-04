from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class CreateListing(models.Model):
    title = models.CharField(max_length=255)
    image_url = models.URLField()
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.title


class AuctionList(models.Model):
    auction_list = models.ManyToManyField(CreateListing, blank=True, related_name="listings")

    def __str__(self):
        return ", ".join(listing.title for listing in self.auction_list.all())


class ListDetails(models.Model):
    list_details = models.ForeignKey(CreateListing, on_delete=models.CASCADE, related_name="list_details")
    bid = models.DecimalField(max_digits=20, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bids")

    def __str__(self):
        return f"{self.list_details.title} - {self.bid} by {self.user.username}"

