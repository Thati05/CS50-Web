from rest_framework import generics, permissions
#Need to get data from our models made in our main application
from network.models import Post
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response

class PostList(generics.ListCreateAPIView):
  queryset = Post.objects.all()
  serializer_class = PostSerializer
 # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class RegisterUser(APIView):
  permissions_classes = [AllowAny]

  def post(self, request):
    reg_serializer = RegisterUserSerializer(data=request.data)
    if reg_serializer.is_valid():
      newuser = reg_serializer.save()
      if newuser:
        return Response(status=status.HTTP_201_CREATED)
      return Response(reg_serializer.errors, status=status>HTTP_400_BAD_REQUEST)
    