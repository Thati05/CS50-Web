from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('wiki/<str:title>/', views.title, name='title'),
    path('create/', views.createPage, name='create-page'),
    path('edit/<str:title>', views.edit, name='edit')
]
