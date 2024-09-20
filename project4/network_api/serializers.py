from rest_framework import serializers
from network.models import *

# Post serializer


class PostSerializer(serializers.ModelSerializer):
    creator_username = serializers.CharField(source='creator.username', read_only=True)
    profile_pic = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()  # Dynamically calculate like_count

    class Meta:
        model = Post
        fields = ['id', 'creator', 'creator_username', 'profile_pic', 'content', 'created_at', 'updated_at', 'like_count', 'liked']
        read_only_fields = ['id', 'creator', 'creator_username', 'profile_pic', 'created_at', 'updated_at', 'like_count']

    def get_profile_pic(self, obj):
        # Get the profile picture from the user's profile
        if obj.creator.profile and obj.creator.profile.profile_pic:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.creator.profile.profile_pic.url)
        return None

    def get_liked(self, obj):
        # Check if the user has liked the post
        request = self.context.get('request')
        user = request.user
        if user.is_authenticated:
            return Like.objects.filter(user=user, post=obj).exists()
        return False

    def get_like_count(self, obj):
        # Return the number of likes for the post
        return obj.post_likes.count()


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
    profile_pic = serializers.ImageField()  # Allow direct uploading of images

    class Meta:
        model = Profile
        fields = ['user', 'email', 'about', 'profile_pic', 'follower_count', 'following_count']

    # Get the full URL for the profile picture
    def get_profile_pic(self, obj):
        request = self.context.get('request')  # Ensure request is available in the context
        if obj.profile_pic:
            return request.build_absolute_uri(obj.profile_pic.url)
        return None

    def get_follower_count(self, obj):
        return obj.user.followers.count()

    def get_following_count(self, obj):
        return obj.user.following.count()


# Follow serializer
class FollowSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    followed_user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Follow
        fields = ['user', 'followed_user']


# Like serializer
class LikeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    post = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Like
        fields = ['user', 'post']

    def create(self, validated_data):
        user = self.context['request'].user
        post = self.context.get('post')  # Get the post from context
        like, created = Like.objects.get_or_create(user=user, post=post)
        return like
