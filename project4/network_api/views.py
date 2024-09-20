from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from network.models import Post, Profile, Follow, Like, User
from .serializers import PostSerializer, RegisterUserSerializer, ProfileSerializer, FollowSerializer, LikeSerializer
from django.shortcuts import get_object_or_404


# Post list and create view
class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
    
    def get_serializer_context(self):
        # Pass the request context to the serializer
        return {'request': self.request}


# Register user view
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
        user = get_object_or_404(User, username=username)
        profile = get_object_or_404(Profile, user=user)
        serializer = ProfileSerializer(profile, context={'request': request})  
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, username):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View to handle follow/unfollow actions
class FollowUser(APIView):
    #permission_classes = [IsAuthenticated]

    def post(self, request, username):
        user_to_follow = get_object_or_404(User, username=username)
        if request.user == user_to_follow:
            return Response({"error": "You cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)

        follow, created = Follow.objects.get_or_create(user=request.user, followed_user=user_to_follow)
        if not created:
            return Response({"message": "You are already following this user"}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"message": "Followed user successfully"}, status=status.HTTP_201_CREATED)

    def delete(self, request, username):
        user_to_unfollow = get_object_or_404(User, username=username)
        follow = Follow.objects.filter(user=request.user, followed_user=user_to_unfollow)
        if follow.exists():
            follow.delete()
            return Response({"message": "Unfollowed user successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "You are not following this user"}, status=status.HTTP_400_BAD_REQUEST)


# View to handle likes and unlikes
class LikePost(APIView):
    #permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            # Get the post by ID
            post = Post.objects.get(id=post_id)
            user = request.user

            # Check if the user has already liked the post
            like, created = Like.objects.get_or_create(user=user, post=post)

            if not created:
                # If like already exists, unlike the post (remove the like)
                like.delete()
                liked = False
            else:
                # If no like exists, it means the user just liked the post
                liked = True

            # Return the updated like count
            like_count = post.post_likes.count()

            return Response({
                'liked': liked,
                'like_count': like_count
            }, status=status.HTTP_200_OK)

        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)


class CreatePost(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]  # Ensure the user is logged in

    def perform_create(self, serializer):
        try:
            # Automatically assign the logged-in user as the creator
            serializer.save(creator=self.request.user)
        except Exception as e:
            # Log the error to the console or server logs
            print(f"Error during creation: {e}")
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)