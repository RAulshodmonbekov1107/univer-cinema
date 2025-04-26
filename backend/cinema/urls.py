from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Set up router for ViewSets
router = DefaultRouter()
router.register(r'movies', views.MovieViewSet, basename='movie')
router.register(r'halls', views.HallViewSet, basename='hall')
router.register(r'showtimes', views.ShowtimeViewSet, basename='showtime')
router.register(r'snacks', views.SnackViewSet, basename='snack')
router.register(r'bookings', views.BookingViewSet, basename='booking')
router.register(r'news', views.NewsViewSet, basename='news')
router.register(r'gallery', views.GalleryViewSet, basename='gallery')

urlpatterns = [
    # API Root
    path('', views.api_root, name='api-root'),
    
    # Include router URLs
    path('', include(router.urls)),
    
    # Authentication endpoints
    path('auth/register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('auth/me/', views.UserProfileView.as_view(), name='user-me'),
    
    # Password reset
    path('auth/password-reset/', views.PasswordResetView.as_view(), name='password-reset'),
    path('auth/password-reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # Additional endpoints
    path('showtimes/<uuid:showtime_id>/seats/', views.available_seats, name='available-seats'),
] 