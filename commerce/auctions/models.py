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

    title = models.CharField(max_length=64, validators=[MinLengthValidator(40)] )
    image_url = models.URLField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, default="No category", choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=300, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    
    

    def __str__(self):
        return self.title




class ListDetails(models.Model):
    list_details = models.ForeignKey(CreateListing, on_delete=models.CASCADE, related_name="list_details")
    bid = models.DecimalField(max_digits=20, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_bids", null=True, blank=True)
    comment = models.CharField(max_length=65, null=True, blank=True)

    def __str__(self):
        return f"{self.list_details.title} - Bid by {self.user.username}"
