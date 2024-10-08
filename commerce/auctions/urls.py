from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create-listing", views.create_listings, name="create-listing"),
    path("listing/<int:auction_id>/", views.details_listing, name='listing'),
    path("my-listings/", views.my_listings, name="my-listings"), 
    path("watchlist/", views.watchlist, name="watchlist"),
    path("categories/", views.categories, name="categories"),
    path("category/<str:category>/", views.category, name="category"),
    path('test-404/', views.test_404_view),

    
    ]
