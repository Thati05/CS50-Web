from rest_framework import serializers
from network.models import *


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'creator', 'content', 'created_at', 'updated_at', 'like_count']
    
    def create(self, validated_data):
        user = self.context['request'].user  
        return Post.objects.create(creator=user, **validated_data)
        
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
    follower_count = serializers.IntegerField(read_only=True)  
    following_count = serializers.IntegerField(read_only=True) 

    class Meta:
        model = Profile
        fields = ['user', 'about', 'profile_pic', 'follower_count', 'following_count']

    def update(self, instance, validated_data):
        instance.about = validated_data.get('about', instance.about)
        if 'profile_pic' in validated_data:
            instance.profile_pic = validated_data['profile_pic']
        instance.save()
        return instance



class FollowSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # The current user (follower)
    followed_user = serializers.StringRelatedField(read_only=True)  # The followed user

    class Meta:
        model = Follow
        fields = ['user', 'followed_user']
        

class LikeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # The user who liked the post
    post = serializers.StringRelatedField(read_only=True)  # The post that was liked

    class Meta:
        model = Like
        fields = ['user', 'post']

    def create(self, validated_data):
        user = self.context['request'].user
        post = validated_data.get('post')
        like, created = Like.objects.get_or_create(user=user, post=post)
        return like

