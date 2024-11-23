from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Custom User model."""
    # Additional fields can be added here if needed.

    def follower_count(self):
        """Return the number of followers for this user."""
        return Follow.objects.filter(following=self).count()

    def following_count(self):
        """Return the number of users this user is following."""
        return Follow.objects.filter(follower=self).count()

    def is_following(self, user):
        """Check if the current user is following the given user."""
        return Follow.objects.filter(follower=self, following=user).exists()


class Post(models.Model):
    """Model representing a post."""
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name="liked_posts", blank=True)

    def like_count(self):
        """Return the number of likes for this post."""
        return self.likes.count()

    def __str__(self):
        return f"{self.author.username}: {self.content[:20]}"


class Follow(models.Model):
    """Model representing the follow relationship between users."""
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following_set")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower_set")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')  # Ensure unique follow relationships

    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"
