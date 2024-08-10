from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinLengthValidator


class User(AbstractUser):
    pass


def get_default_user():
    # Assuming the default user has a primary key of 1
    return User.objects.get(pk=1)


class CreateListing(models.Model):
    CATEGORY_CHOICES = [
        ('Fashion', 'Fashion'),
        ('Art & Crafts', 'Art & Crafts'),
        ('Electronics', 'Electronics'),
        ('Skincare', 'Skincare')
    ]

    title = models.CharField(max_length=64, validators=[MinLengthValidator(40)])
    image_url = models.URLField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, default="No category", choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=300, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=get_default_user)

    def __str__(self):
        return self.title



class ListDetails(models.Model):
    list_details = models.ForeignKey(CreateListing, on_delete=models.CASCADE, related_name="list_details")
    bid = models.DecimalField(max_digits=20, decimal_places=2)

    def __str__(self):
        return f"{self.list_details.title} - Bid by {self.user.username}"
