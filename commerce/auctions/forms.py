from django import forms
from .models import CreateListing

class AuctionListingForm(forms.ModelForm):
    class Meta:
        model = CreateListing
        fields = '__all__'
        widgets = {
            'image_url': forms.URLInput(attrs={'size': 40}),
            'title': forms.TextInput(attrs={'size': 30}),
            'description': forms.Textarea(attrs={'cols': 20, 'rows': 4}),
            'price': forms.NumberInput(attrs={'size': 10}),
            'category': forms.Select(attrs={'size': 1}),
        }

