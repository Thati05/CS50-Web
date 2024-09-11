from django.contrib.auth.models import User
from django.db import models

#Post Model
class Post(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta: 
        ordering = ('-created_at',) # N/B the comma bc this is a tuple 
    
    def __str__(self):
        return f"{self.creator.username}: {self.content[0:10]}..."
    

    
