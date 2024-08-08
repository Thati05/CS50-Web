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

    #user = models.ForeignKey(User,on_delete=models.CASCADE, related_name="listings", default="Username" )
    image_url = models.URLField()
    title = models.CharField(max_length=64, validators=[MinLengthValidator(45)] )
    description = models.CharField(max_length=300, default="No description")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, default="No category", choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    

    def __str__(self):
        return self.title



class ListDetails(models.Model):
    list_details = models.ForeignKey(CreateListing, on_delete=models.CASCADE, related_name="list_details")
    bid = models.DecimalField(max_digits=20, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bids")

    def __str__(self):
        return f"{self.list_details.title}"

