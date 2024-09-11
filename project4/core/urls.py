
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('network.urls')),
    path('api/', include('network_api.urls'))
    
    
]
