from rest_framework import serializers
from network.models import *

# Post serializer


class PostSerializer(serializers.ModelSerializer):
    creator_username = serializers.CharField(source='creator.username', read_only=True)
    profile_pic = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField() 

    class Meta:
        model = Post
        fields = ['id', 'creator', 'creator_username', 'profile_pic', 'content', 'created_at', 'updated_at', 'like_count', 'liked']
        read_only_fields = ['id', 'creator', 'creator_username', 'profile_pic', 'created_at', 'updated_at', 'like_count']

    def get_profile_pic(self, obj):
        if obj.creator.profile and obj.creator.profile.profile_pic:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.creator.profile.profile_pic.url)
        return None

    def get_liked(self, obj):
        request = self.context.get('request')
        user = request.user
        if user.is_authenticated:
            return Like.objects.filter(user=user, post=obj).exists()
        return False

    def get_like_count(self, obj):
        return obj.post_likes.count()
    
class PostDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'content', 'created_at', 'updated_at']  # Fields to display/edit
        read_only_fields = ['id', 'created_at', 'updated_at']  # These fields cannot be edited


# Register user serializer
class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


# Profile serializer


class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    profile_pic = serializers.SerializerMethodField()  
    posts = serializers.SerializerMethodField()  # To include user's posts
    

    class Meta:
        model = Profile
        fields = ['user', 'email', 'about', 'profile_pic', 'follower_count', 'following_count', 'posts']

    # Get full URL for the profile picture
    def get_profile_pic(self, obj):
        request = self.context.get('request')  # Get request context
        if obj.profile_pic and request:
            return request.build_absolute_uri(obj.profile_pic.url)
        return None

    # Get follower count
    def get_follower_count(self, obj):
        return obj.user.followers.count()

    # Get following count
    def get_following_count(self, obj):
        return obj.user.following.count()

    # Get posts authored by the user
    def get_posts(self, obj):
        user_posts = Post.objects.filter(creator=obj.user) 
        return PostSerializer(user_posts, many=True, context=self.context).data 



# Follow serializer
class FollowSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    followed_user = serializers.StringRelatedField(read_only=True)
    followings_posts = serializers.SerializerMethodField()  # Use SerializerMethodField to customize the output

    class Meta:
        model = Follow
        fields = ['user', 'followed_user', 'followings_posts']  # Include followings_posts in fields

    def get_followings_posts(self, obj):
        # Get all posts from the followed user
        following_posts = Post.objects.filter(creator=obj.followed_user).order_by('-created_at')  # Get posts by followed users
        return PostSerializer(following_posts, many=True, context=self.context).data  # Serialize the posts

# Like serializer
class LikeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    post = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Like
        fields = ['user', 'post']

    def create(self, validated_data):
        user = self.context['request'].user
        post = self.context.get('post')  
        like, created = Like.objects.get_or_create(user=user, post=post)
        return like
