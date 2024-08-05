from django import forms
from .models import CreateListing

class AuctionListingForm(forms.ModelForm):
    class Meta:
        model = CreateListing
        fields = ['image_url', 'title', 'description', 'price', 'category']
