from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid

# Create your models here.
class Movie(models.Model):
    GENRE_CHOICES = [
        ('action', 'Action'),
        ('comedy', 'Comedy'),
        ('drama', 'Drama'),
        ('horror', 'Horror'),
        ('sci_fi', 'Sci-Fi'),
        ('fantasy', 'Fantasy'),
        ('romance', 'Romance'),
        ('thriller', 'Thriller'),
        ('animation', 'Animation'),
        ('documentary', 'Documentary'),
    ]
    
    LANGUAGE_CHOICES = [
        ('kg', 'Kyrgyz'),
        ('ru', 'Russian'),
        ('en', 'English'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title_kg = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255)
    synopsis_kg = models.TextField()
    synopsis_ru = models.TextField()
    trailer = models.URLField()
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES)
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES)
    duration = models.IntegerField(help_text="Duration in minutes")
    poster = models.ImageField(upload_to='movie_posters/')
    release_date = models.DateField()
    is_showing = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title_kg

class Hall(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    capacity = models.IntegerField()
    layout_json = models.JSONField(help_text="JSON representation of the hall layout")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class Showtime(models.Model):
    LANGUAGE_CHOICES = [
        ('kg', 'Kyrgyz'),
        ('ru', 'Russian'),
        ('en', 'English'),
        ('original', 'Original'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='showtimes')
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE, related_name='showtimes')
    datetime = models.DateTimeField()
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['datetime']
    
    def __str__(self):
        return f"{self.movie.title_kg} - {self.datetime.strftime('%Y-%m-%d %H:%M')}"

class Snack(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name_kg = models.CharField(max_length=100)
    name_ru = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='snack_images/')
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name_kg

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    showtime = models.ForeignKey(Showtime, on_delete=models.CASCADE, related_name='bookings')
    seats_json = models.JSONField(help_text="JSON array of selected seats")
    snack_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    ticket_total = models.DecimalField(max_digits=10, decimal_places=2)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    qr_code = models.ImageField(upload_to='booking_qrcodes/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Booking {self.id} - {self.user.username}"
    
    def save(self, *args, **kwargs):
        # Calculate the grand total
        if not self.grand_total:
            self.grand_total = self.snack_total + self.ticket_total
        super().save(*args, **kwargs)

class SnackOrder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='snack_orders')
    snack = models.ForeignKey(Snack, on_delete=models.CASCADE, related_name='orders')
    quantity = models.PositiveIntegerField(default=1)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.quantity} x {self.snack.name_kg}"
    
    def save(self, *args, **kwargs):
        # Calculate the subtotal
        if not self.subtotal:
            self.subtotal = self.quantity * self.snack.price
        super().save(*args, **kwargs)

class News(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title_kg = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255)
    content_kg = models.TextField()
    content_ru = models.TextField()
    image = models.ImageField(upload_to='news_images/')
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "News"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title_kg

class Gallery(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image_url = models.ImageField(upload_to='gallery/')
    caption_kg = models.CharField(max_length=255)
    caption_ru = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Galleries"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.caption_kg

class PasswordReset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_resets')
    token = models.CharField(max_length=100)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Password reset for {self.user.username}"
    
    def is_valid(self):
        return not self.used and self.expires_at > timezone.now()
