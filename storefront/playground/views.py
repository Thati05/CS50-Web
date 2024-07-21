from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def say_thanks(request):
  return HttpResponse("Thank You, Jesus Christ!")
