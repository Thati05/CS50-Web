from rest_framework import serializers
from network.models import Post

class PostSerializer(serializers.ModelSerializer):
  
    class Meta:
        model = Post
        fields = ['id', 'creator', 'content', 'created_at', 'updated_at']