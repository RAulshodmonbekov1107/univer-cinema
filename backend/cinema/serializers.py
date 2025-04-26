from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Movie, Hall, Showtime, Snack, 
    Booking, SnackOrder, News, Gallery
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = '__all__'

class ShowtimeSerializer(serializers.ModelSerializer):
    movie_title_kg = serializers.CharField(source='movie.title_kg', read_only=True)
    movie_title_ru = serializers.CharField(source='movie.title_ru', read_only=True)
    hall_name = serializers.CharField(source='hall.name', read_only=True)
    
    class Meta:
        model = Showtime
        fields = '__all__'
        extra_kwargs = {
            'movie': {'write_only': True},
            'hall': {'write_only': True}
        }

class SnackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snack
        fields = '__all__'

class SnackOrderSerializer(serializers.ModelSerializer):
    snack_name_kg = serializers.CharField(source='snack.name_kg', read_only=True)
    snack_name_ru = serializers.CharField(source='snack.name_ru', read_only=True)
    snack_image = serializers.ImageField(source='snack.image', read_only=True)
    
    class Meta:
        model = SnackOrder
        fields = '__all__'
        extra_kwargs = {
            'booking': {'write_only': True}
        }
    
    def create(self, validated_data):
        # Calculate subtotal based on quantity and snack price
        snack = validated_data.get('snack')
        quantity = validated_data.get('quantity', 1)
        validated_data['subtotal'] = snack.price * quantity
        return super().create(validated_data)

class BookingSerializer(serializers.ModelSerializer):
    snack_orders = SnackOrderSerializer(many=True, read_only=True)
    movie_title_kg = serializers.CharField(source='showtime.movie.title_kg', read_only=True)
    movie_title_ru = serializers.CharField(source='showtime.movie.title_ru', read_only=True)
    datetime = serializers.DateTimeField(source='showtime.datetime', read_only=True)
    hall_name = serializers.CharField(source='showtime.hall.name', read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['grand_total', 'status', 'qr_code']
    
    def create(self, validated_data):
        # Calculate ticket_total based on showtime price and number of seats
        showtime = validated_data.get('showtime')
        seats = validated_data.get('seats_json', [])
        validated_data['ticket_total'] = showtime.price * len(seats)
        
        # Set grand_total
        validated_data['grand_total'] = validated_data['ticket_total'] + validated_data.get('snack_total', 0)
        
        return super().create(validated_data)

class BookingCreateSerializer(serializers.ModelSerializer):
    snack_orders = SnackOrderSerializer(many=True, write_only=True, required=False)
    
    class Meta:
        model = Booking
        fields = ['showtime', 'seats_json', 'snack_orders', 'snack_total', 'ticket_total']
    
    def create(self, validated_data):
        snack_orders_data = validated_data.pop('snack_orders', [])
        
        # Calculate ticket_total based on showtime price and number of seats
        showtime = validated_data.get('showtime')
        seats = validated_data.get('seats_json', [])
        validated_data['ticket_total'] = showtime.price * len(seats)
        
        # Set snack_total from the sum of all snack orders or use provided value
        if not validated_data.get('snack_total') and snack_orders_data:
            snack_total = 0
            for snack_order in snack_orders_data:
                snack = snack_order.get('snack')
                quantity = snack_order.get('quantity', 1)
                snack_total += snack.price * quantity
            validated_data['snack_total'] = snack_total
        
        # Set grand_total
        validated_data['grand_total'] = validated_data['ticket_total'] + validated_data.get('snack_total', 0)
        
        # Create booking
        booking = Booking.objects.create(**validated_data)
        
        # Create snack orders
        for snack_order_data in snack_orders_data:
            snack_order_data['booking'] = booking
            SnackOrder.objects.create(**snack_order_data)
        
        return booking

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'

class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = '__all__'

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data 