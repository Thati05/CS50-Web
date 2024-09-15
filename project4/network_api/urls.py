"""
In our api urls.py we are going to build api endpoints 

"""

from django.urls import path
from .views import PostList, RegisterUser

app_name = 'network_api'

urlpatterns = [
    path('', PostList.as_view(), name='posts'),
    path('register/', RegisterUser.as_view(), name='register')
]
