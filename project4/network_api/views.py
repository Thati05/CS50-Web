from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from network.models import Post
from .serializers import PostSerializer, RegisterUserSerializer
from rest_framework.permissions import AllowAny

class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class RegisterUser(APIView):
    permission_classes = [AllowAny]  # Allow registration to any user

    def post(self, request):
        reg_serializer = RegisterUserSerializer(data=request.data)
        if reg_serializer.is_valid():
            newuser = reg_serializer.save()
            if newuser:
                return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(reg_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
