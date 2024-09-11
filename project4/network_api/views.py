from rest_framework import generics, permissions
#Need to get data from our models made in our main application
from network.models import Post
from .serializers import *

class PostList(generics.ListCreateAPIView):
  queryset = Post.objects.all()
  serializer_class = PostSerializer
  permission_classes = [permissions.IsAuthenticatedOrReadOnly]
