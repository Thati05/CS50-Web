from django import forms
from .models import CreateListing

class AuctionListingForm(forms.ModelForm):
    class Meta:
        model = CreateListing
        fields = '__all__'


