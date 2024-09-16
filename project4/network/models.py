from django.contrib.auth.models import User
from django.db import models

# Profile Model
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    about = models.TextField(blank=True, null=True)  # Optional 'about' section
    profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)  # Optional profile picture

    # Automatically create a profile when a user is created
    def __str__(self):
        return f"{self.user.username}'s Profile"

    def post_count(self):
        """Returns the number of posts made by the user."""
        return self.user.posts.count()

    def follower_count(self):
        """Returns the number of followers the user has."""
        return self.user.followers.count()

    def following_count(self):
        """Returns the number of people the user is following."""
        return self.user.following.count()

# Post Model
class Post(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)  # Many users can like many posts
    
    class Meta:
        ordering = ('-created_at',)  # Order posts by the most recent

    def __str__(self):
        return f"{self.creator.username}: {self.content[0:10]}..."

    def like_count(self):
        """Returns the number of likes for the post."""
        return self.likes.count()

    def can_edit(self, user):
        """Checks if the user can edit the post (only the creator can edit)."""
        return self.creator == user

    def can_delete(self, user):
        """Checks if the user can delete the post (only the creator can delete)."""
        return self.creator == user

# Follow Model
class Follow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    followed_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")

    class Meta:
        unique_together = ('user', 'followed_user')

    def __str__(self):
        return f"{self.user.username} follows {self.followed_user.username}"

# Like Model
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_likes")

    class Meta:
        unique_together = ('user', 'post')

    def __str__(self):
        return f"{self.user.username} likes {self.post.creator.username}'s post"

# Signal to create or update the profile whenever a user is created/updated
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()
