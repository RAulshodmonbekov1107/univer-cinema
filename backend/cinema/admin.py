from django.contrib import admin
from .models import (
    Movie, Hall, Showtime, Snack, 
    Booking, SnackOrder, News, 
    Gallery, PasswordReset
)

# Register your models here.
@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title_kg', 'title_ru', 'genre', 'language', 'duration', 'is_showing')
    list_filter = ('genre', 'language', 'is_showing')
    search_fields = ('title_kg', 'title_ru')

@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    list_display = ('name', 'capacity')

@admin.register(Showtime)
class ShowtimeAdmin(admin.ModelAdmin):
    list_display = ('movie', 'hall', 'datetime', 'language', 'price')
    list_filter = ('hall', 'language')
    search_fields = ('movie__title_kg', 'movie__title_ru')

@admin.register(Snack)
class SnackAdmin(admin.ModelAdmin):
    list_display = ('name_kg', 'name_ru', 'price', 'available')
    list_filter = ('available',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'showtime', 'ticket_total', 'snack_total', 'grand_total', 'status')
    list_filter = ('status',)
    search_fields = ('user__username', 'showtime__movie__title_kg')

@admin.register(SnackOrder)
class SnackOrderAdmin(admin.ModelAdmin):
    list_display = ('booking', 'snack', 'quantity', 'subtotal')

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title_kg', 'title_ru', 'published', 'created_at')
    list_filter = ('published',)
    search_fields = ('title_kg', 'title_ru', 'content_kg', 'content_ru')

@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('caption_kg', 'caption_ru', 'created_at')

@admin.register(PasswordReset)
class PasswordResetAdmin(admin.ModelAdmin):
    list_display = ('user', 'expires_at', 'used')
    list_filter = ('used',)
