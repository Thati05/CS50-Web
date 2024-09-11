"""
We are to to build a class based template view,
this is going to bee the homepage of our web application 

"""
from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
  
  path('', TemplateView.as_view(template_name='network/index.html'))
  
]
