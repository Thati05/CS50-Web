from rest_framework import serializers
from network.models import Post

class PostSerializer(serializers.ModelSerializer):
  model = Post
  fields = ('id', 'creator', 'created_at', 'updated_at')