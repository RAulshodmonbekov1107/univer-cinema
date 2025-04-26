from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.utils import timezone
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils.crypto import get_random_string
from django.db.models import Q

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework import status, viewsets, generics
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from datetime import timedelta
import uuid

from .models import (
    Movie, Hall, Showtime, Snack, 
    Booking, SnackOrder, News, Gallery, PasswordReset
)
from .serializers import (
    UserSerializer, UserRegistrationSerializer, MovieSerializer,
    HallSerializer, ShowtimeSerializer, SnackSerializer,
    BookingSerializer, BookingCreateSerializer, SnackOrderSerializer,
    NewsSerializer, GallerySerializer, PasswordResetSerializer,
    PasswordResetConfirmSerializer
)

# Create your views here.
@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request, format=None):
    """
    The root of the Univer Cinema API.
    """
    return Response({
        'message': 'Welcome to Univer Cinema API',
        'version': '1.0.0',
        'endpoints': {
            'movies': reverse('movie-list', request=request, format=format),
            'showtimes': reverse('showtime-list', request=request, format=format),
            'snacks': reverse('snack-list', request=request, format=format),
            'news': reverse('news-list', request=request, format=format),
            'gallery': reverse('gallery-list', request=request, format=format),
            'auth': {
                'register': reverse('user-register', request=request, format=format),
                'me': reverse('user-me', request=request, format=format),
            }
        }
    })

# User views
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Movie views
class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
    
    def get_queryset(self):
        queryset = Movie.objects.all()
        
        # Filter by 'is_showing' parameter
        showing = self.request.query_params.get('showing', None)
        if showing is not None:
            if showing.lower() == 'true':
                queryset = queryset.filter(is_showing=True)
        
        # Filter by genre
        genre = self.request.query_params.get('genre', None)
        if genre is not None:
            queryset = queryset.filter(genre=genre)
        
        # Filter by language
        language = self.request.query_params.get('language', None)
        if language is not None:
            queryset = queryset.filter(language=language)
        
        # Search by title (in both languages)
        search = self.request.query_params.get('search', None)
        if search is not None:
            queryset = queryset.filter(
                Q(title_kg__icontains=search) | Q(title_ru__icontains=search)
            )
        
        return queryset

# Hall views
class HallViewSet(viewsets.ModelViewSet):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()

# Showtime views
class ShowtimeViewSet(viewsets.ModelViewSet):
    queryset = Showtime.objects.all()
    serializer_class = ShowtimeSerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
    
    def get_queryset(self):
        queryset = Showtime.objects.all()
        
        # Filter by movie
        movie_id = self.request.query_params.get('movie', None)
        if movie_id is not None:
            queryset = queryset.filter(movie__id=movie_id)
        
        # Filter by hall
        hall_id = self.request.query_params.get('hall', None)
        if hall_id is not None:
            queryset = queryset.filter(hall__id=hall_id)
        
        # Filter by date (only future showtimes)
        date = self.request.query_params.get('date', None)
        if date is not None:
            queryset = queryset.filter(datetime__date=date)
        else:
            # If no date provided, show future showtimes
            queryset = queryset.filter(datetime__gte=timezone.now())
        
        # Filter by language
        language = self.request.query_params.get('language', None)
        if language is not None:
            queryset = queryset.filter(language=language)
        
        return queryset

# Snack views
class SnackViewSet(viewsets.ModelViewSet):
    queryset = Snack.objects.all()
    serializer_class = SnackSerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
    
    def get_queryset(self):
        return Snack.objects.filter(available=True)

# Booking views
class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status='confirmed')

# News views
class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
    
    def get_queryset(self):
        return News.objects.filter(published=True)

# Gallery views
class GalleryViewSet(viewsets.ModelViewSet):
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()

# Password reset views
class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                
                # Generate token
                token = get_random_string(64)
                expires_at = timezone.now() + timedelta(hours=24)
                
                # Save reset token
                PasswordReset.objects.create(
                    user=user,
                    token=token,
                    expires_at=expires_at
                )
                
                # In a real application, you would send an email with the reset link
                return Response({
                    'message': 'Password reset link has been sent to your email',
                    'token': token  # Include token in response for development
                })
            except User.DoesNotExist:
                return Response({
                    'message': 'Password reset link has been sent if the email exists'
                })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            password = serializer.validated_data['password']
            
            try:
                # Find valid token
                password_reset = PasswordReset.objects.get(
                    token=token,
                    used=False,
                    expires_at__gt=timezone.now()
                )
                
                # Validate password
                try:
                    validate_password(password, password_reset.user)
                except ValidationError as e:
                    return Response({'password': e.messages}, status=status.HTTP_400_BAD_REQUEST)
                
                # Update user password
                user = password_reset.user
                user.set_password(password)
                user.save()
                
                # Mark token as used
                password_reset.used = True
                password_reset.save()
                
                return Response({'message': 'Password has been reset successfully'})
            
            except PasswordReset.DoesNotExist:
                return Response(
                    {'token': 'Invalid or expired token'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Check available seats for a showtime
@api_view(['GET'])
@permission_classes([AllowAny])
def available_seats(request, showtime_id):
    showtime = get_object_or_404(Showtime, id=showtime_id)
    bookings = Booking.objects.filter(showtime=showtime, status__in=['confirmed', 'pending'])
    
    # Get all booked seats
    booked_seats = []
    for booking in bookings:
        booked_seats.extend(booking.seats_json)
    
    # Get hall layout
    hall_layout = showtime.hall.layout_json
    
    return Response({
        'showtime': ShowtimeSerializer(showtime).data,
        'hall_layout': hall_layout,
        'booked_seats': booked_seats
    })
