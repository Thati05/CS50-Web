from django.urls import path
from . import views

urlpatterns = [
  path('Thank-You/', views.say_thanks),
 
]