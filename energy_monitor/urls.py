from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Your app’s API routes
    path('api/', include('api.urls')),

    # Djoser user management (registration, password reset, etc.)
    path('api/auth/', include('djoser.urls')),
    # Djoser token endpoints
    path('api/auth/', include('djoser.urls.authtoken')),
]
