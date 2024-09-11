"""
In our api urls.py we are going to build api endpoints 

"""

from django.urls import path
from .views import PostList

app_name = 'network_api'

urlpatterns = [
    
   path('', PostList.as_view(), name='posts')
    
]
