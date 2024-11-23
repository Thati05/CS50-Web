from django.urls import path
from . import views

urlpatterns = [
    # Default route
    path("", views.index, name="index"),
    
    # Authentication routes
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    
    # Post-related routes
    path("new_post", views.new_post, name="new_post"),
    path("edit_post/<int:post_id>", views.edit_post, name="edit_post"),
    
    # User profile and following
    path("profile/<str:username>", views.profile, name="profile"),
    path("follow_toggle/<str:username>", views.follow_toggle, name="follow_toggle"),
    path("like_toggle/<int:post_id>", views.like_toggle, name="like_toggle"),
    
    # Following-specific posts
    path("following", views.following, name="following"),
]
