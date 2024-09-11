
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('network.urls', namespace='network')),
    path('api/', include('network_api.urls', namespace='network_api'))
    
    
]
