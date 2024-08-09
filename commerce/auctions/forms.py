from django import forms
from .models import CreateListing

class AuctionListingForm(forms.ModelForm):
    class Meta:
        model = CreateListing
        fields = '__all__'
        widgets = {
            'image_url': forms.URLInput(attrs={
                'size': 40, 
                'class': 'form-control url-input'
            }),
            'title': forms.TextInput(attrs={
                'size': 30, 
                'class': 'form-control title-input'
            }),
            'price': forms.NumberInput(attrs={
                'size': 10, 
                'class': 'form-control price-input'
            }),
            'category': forms.Select(attrs={
                'size': 1, 
                'class': 'form-control category-select'
            }),
            'description': forms.Textarea(attrs={
                'cols': 20, 
                'rows': 4, 
                'class': 'form-control description-textarea'
            }),
        }
