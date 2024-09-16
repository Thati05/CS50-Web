"""
In our api urls.py we are going to build api endpoints 

"""

from django.urls import path
from .views import *

app_name = 'network_api'

urlpatterns = [
    # Post endpoints
    path('', PostList.as_view(), name='posts'),
    
    # User registration endpoint
    path('register/', RegisterUser.as_view(), name='register'),
    
    # Profile endpoints (view or update a user's profile)
    path('profile/<str:username>/', ProfileDetail.as_view(), name='profile'),

    # Follow/unfollow user endpoints
    path('follow/<str:username>/', FollowUser.as_view(), name='follow'),
    
    # Like/unlike post endpoints
    path('like/<int:post_id>/', LikePost.as_view(), name='like')
]
