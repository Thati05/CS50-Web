from django import forms
from django.contrib.auth.models import User
from .models import Profile

class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username']
        widgets = {
            'username': forms.TextInput(attrs={
                'class': 'w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500',
                'placeholder': 'Profile name'
            }),
        }

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['profile_image']
        widgets = {
            'profile_image': forms.ClearableFileInput(attrs={
                'class': 'w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }),
        }
