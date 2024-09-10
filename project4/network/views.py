from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.urls import reverse
from rest_framework.response import Response # Get json response that is more formatted 
from rest_framework.decorators import api_view # Styles the rest api
from .serializers import *
from .models import User, Post




def index(request):
    routes = [
        {
            'Endpoint': '/posts/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of posts'
        },
        {
            'Endpoint': '/posts/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single post object'
        },
        {
            'Endpoint': '/post/create/',
            'method': 'POST',
            'body': {'body': ""},
            'description': 'Creates new post with data sent in post request'
        },
        {
            'Endpoint': '/post/id/update/',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'Creates an existing post with data sent in post request'
        },
        {
            'Endpoint': '/posts/id/delete/',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes and exiting post'
        },
    ]
    return render(request, "network/index.html")

@api_view(['GET'])
def getPosts(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True) # many=True means that we will like to serializer multiple objects
    return Response(serializer.data)

    
    
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
