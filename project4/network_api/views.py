from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from network.models import Post, Profile, Follow, Like, User
from .serializers import PostSerializer, RegisterUserSerializer, ProfileSerializer, FollowSerializer, LikeSerializer
class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user) 

class RegisterUser(APIView):
    permission_classes = [AllowAny]  # Allow registration to any user

    def post(self, request):
        reg_serializer = RegisterUserSerializer(data=request.data)
        if reg_serializer.is_valid():
            newuser = reg_serializer.save()
            if newuser:
                return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(reg_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View to get and update the user's profile
class ProfileDetail(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            profile = Profile.objects.get(user=user)
            serializer = ProfileSerializer(profile, context={'request': request})  
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, username):
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
            serializer = ProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

# View to handle follow/unfollow actions
class FollowUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        try:
            user_to_follow = User.objects.get(username=username)
            if request.user == user_to_follow:
                return Response({"error": "You cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)

            follow, created = Follow.objects.get_or_create(user=request.user, followed_user=user_to_follow)
            if not created:
                return Response({"message": "You are already following this user"}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({"message": "Followed user successfully"}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, username):
        try:
            user_to_unfollow = User.objects.get(username=username)
            follow = Follow.objects.filter(user=request.user, followed_user=user_to_unfollow)
            if follow.exists():
                follow.delete()
                return Response({"message": "Unfollowed user successfully"}, status=status.HTTP_200_OK)
            return Response({"error": "You are not following this user"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# View to handle likes and unlikes
class LikePost(APIView):
    permission_classes = [AllowAny]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            like, created = Like.objects.get_or_create(user=request.user, post=post)
            if not created:
                return Response({"message": "You already liked this post"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"message": "Post liked successfully"}, status=status.HTTP_201_CREATED)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            like = Like.objects.filter(user=request.user, post=post)
            if like.exists():
                like.delete()
                return Response({"message": "Post unliked successfully"}, status=status.HTTP_200_OK)
            return Response({"error": "You haven't liked this post"}, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)