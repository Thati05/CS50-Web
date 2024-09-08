from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes=models.ManyToManyField(User, related_name="liked_posts", blank=True)
    
    def __str__(self):
        return f"{self.user.username} : {self.content[:30]}"
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image= models.ImageField(upload_to='profile_image/', null=True, blank=True)
    follower = models.ManyToManyField(User, related_name="followed_by", blank=True)
    following = models.ManyToManyField(User, related_name='following', blank=True)
    posts = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='profile')
    remove_post = models.BooleanField(default=False)
    
    def delete_post(self):
        self.remove_post = True
        self.save()
    
    def posts_count(self):
        return self.user.posts.count()
    
    def __str__(self):
        return f"{self.user.username}'s profile"    

class Comment(models.Model):
    posts = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments", default=None)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Commented by {self.user.username} on {self.posts.id}" 