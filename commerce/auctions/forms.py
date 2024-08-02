from  django import forms
from .models import AuctionListing

class AuctionListingForm(forms.ModelForm):
  class Meta:
    model = AuctionListing
    fields = ['image_url', 'title', 'price']