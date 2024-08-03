from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class CreateListing (models.Model):
    image_url = models.URLField( max_length=500)
    title = models.CharField(max_length=64)
    description = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class AuctionList(models.Model):
    auction_list = models.ManyToManyField(CreateListing, blank=True, related_name="listings")

    def __str__(self):
        return ",".join(listing.title for listing in self.auction_list.all())

class Listing(models.Model):
    details_auctionlist = models.ForeignKey(AuctionList, on_delete=models.CASCADE)
    bid = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ManyToManyField(User, related_name="listings")

    def __str__(self):
        return f"{self.details_auctionlist}"