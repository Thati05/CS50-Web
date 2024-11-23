from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from .models import User, Post, Follow


def index(request):
    """Display all posts with pagination."""
    posts = Post.objects.all().order_by("-timestamp")
    paginator = Paginator(posts, 10)  # Show 10 posts per page
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    return render(request, "network/index.html", {"page_obj": page_obj})


def login_view(request):
    """Handle user login."""
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect("index")
        else:
            messages.error(request, "Invalid username or password.")
    return render(request, "network/login.html")


def logout_view(request):
    """Log the user out."""
    logout(request)
    return redirect("index")


def register(request):
    """Handle user registration."""
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]

        if password != confirmation:
            messages.error(request, "Passwords must match.")
            return render(request, "network/register.html")

        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            login(request, user)
            return redirect("index")
        except Exception as e:
            messages.error(request, f"Error: {str(e)}")

    return render(request, "network/register.html")


@login_required
def new_post(request):
    """Create a new post."""
    if request.method == "POST":
        content = request.POST.get("content", "").strip()
        if content:
            Post.objects.create(author=request.user, content=content)
            return redirect("index")
        else:
            messages.error(request, "Post content cannot be empty.")
            return redirect("index")
    return redirect("index")


@login_required
def like_toggle(request, post_id):
    """Toggle like/unlike for a post."""
    post = get_object_or_404(Post, id=post_id)

    if request.user in post.likes.all():
        post.likes.remove(request.user)
        is_liked = False
    else:
        post.likes.add(request.user)
        is_liked = True

    return JsonResponse({
        "status": "success",
        "is_liked": is_liked,
        "like_count": post.like_count(),
    })


def profile(request, username):
    """Display a user's profile and their posts."""
    profile_user = get_object_or_404(User, username=username)
    posts = profile_user.posts.order_by("-timestamp")
    paginator = Paginator(posts, 10)  # Show 10 posts per page
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    is_following = (
        request.user.is_authenticated and
        Follow.objects.filter(follower=request.user, following=profile_user).exists()
    )

    return render(request, "network/profile.html", {
        "profile_user": profile_user,
        "page_obj": page_obj,
        "is_following": is_following,
    })


@login_required
def follow_toggle(request, username):
    user_to_follow = get_object_or_404(User, username=username)

    if request.user == user_to_follow:
        return JsonResponse({"status": "error", "message": "You cannot follow yourself."}, status=400)

    follow_relationship, created = Follow.objects.get_or_create(
        follower=request.user,
        following=user_to_follow,
    )

    if not created:
        follow_relationship.delete()
        is_following = False
    else:
        is_following = True

    return JsonResponse({
        "status": "success",
        "is_following": is_following,
        "follower_count": user_to_follow.follower_count(),
    })


@login_required
def following(request):
    """Display posts from users the current user follows."""
    following_users = Follow.objects.filter(follower=request.user).values_list('following', flat=True)
    posts = Post.objects.filter(author__in=following_users).order_by("-timestamp")
    paginator = Paginator(posts, 10)  # Show 10 posts per page
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    return render(request, "network/following.html", {"page_obj": page_obj})


@login_required
def edit_post(request, post_id):
    """Edit a post's content."""
    post = get_object_or_404(Post, id=post_id)

    if request.method == "PUT":
        if post.author != request.user:
            return JsonResponse({"status": "error", "message": "Unauthorized"}, status=403)

        import json
        data = json.loads(request.body)
        new_content = data.get("content", "").strip()

        if not new_content:
            return JsonResponse({"status": "error", "message": "Content cannot be empty"}, status=400)

        post.content = new_content
        post.save()
        return JsonResponse({"status": "success", "message": "Post updated successfully"})

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=400)
