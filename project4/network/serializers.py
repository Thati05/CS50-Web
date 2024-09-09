from rest_framework.serializers import ModelSerializer

# serialize all models

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, Profile, Comment, User

# Serializing the User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']  # You can add more fields if necessary


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Nested serialization of the user
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'content', 'created_at', 'updated_at', 'likes_count']  # Ensure the 'model' attribute is correct

    def get_likes_count(self, obj):
        return obj.likes.count()


# Serializing the Profile model
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Nested serialization of the user
    posts_count = serializers.SerializerMethodField()  # Custom field to count posts

    class Meta:
        model = Profile
        fields = ['id', 'user', 'profile_image', 'followers', 'following', 'posts_count']

    def get_posts_count(self, obj):
        return obj.user.posts.count()  # Method to count posts for the user


# Serializing the Comment model
class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Nested serialization of the user
    post = PostSerializer(read_only=True)  # Nested serialization of the post

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'content', 'date_added']

