from rest_framework import serializers
from network.models import *


class PostSerializer(serializers.ModelSerializer):
    creator_username = serializers.CharField(source='creator.username', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'creator', 'creator_username', 'content', 'created_at', 'updated_at', 'like_count']
      
        
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
    
    



class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  
    email = serializers.EmailField(source='user.email', read_only=True)  
    follower_count = serializers.SerializerMethodField() 
    following_count = serializers.SerializerMethodField() 
    profile_pic = serializers.SerializerMethodField()  # Get the full URL of the profile picture

    class Meta:
        model = Profile
        fields = ['user', 'email', 'about', 'profile_pic', 'follower_count', 'following_count']

   
    def update(self, instance, validated_data):
        instance.about = validated_data.get('about', instance.about)
        if 'profile_pic' in validated_data:
            instance.profile_pic = validated_data['profile_pic']
        instance.save()
        return instance

    # Get the full URL for the profile picture
    def get_profile_pic(self, obj):
        request = self.context.get('request')  # Make sure request is available in the context
        if obj.profile_pic:
            return request.build_absolute_uri(obj.profile_pic.url)
        return None

  
    def get_follower_count(self, obj):
        return obj.user.followers.count()  

   
    def get_following_count(self, obj):
        return obj.user.following.count() 




class FollowSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True) 
    followed_user = serializers.StringRelatedField(read_only=True)  

    class Meta:
        model = Follow
        fields = ['user', 'followed_user']
        

class LikeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  
    post = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Like
        fields = ['user', 'post']

    def create(self, validated_data):
        user = self.context['request'].user
        post = validated_data.get('post')
        like, created = Like.objects.get_or_create(user=user, post=post)
        return like

