#!/usr/bin/env python
import os
import django
import uuid
from datetime import datetime, timedelta
import random

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cinema_project.settings')
django.setup()

# Import models
from cinema.models import Movie, Hall, Showtime

# Create halls if they don't exist
halls = {
    'standard': {
        'name': 'Standard Hall 1',
        'capacity': 120,
        'layout_json': {
            'rows': 10,
            'seatsPerRow': 12,
            'type': 'standard'
        }
    },
    'vip': {
        'name': 'VIP Hall',
        'capacity': 50,
        'layout_json': {
            'rows': 5,
            'seatsPerRow': 10,
            'type': 'vip'
        }
    }
}

created_halls = {}
for hall_type, hall_data in halls.items():
    hall, created = Hall.objects.get_or_create(
        name=hall_data['name'],
        defaults={
            'capacity': hall_data['capacity'],
            'layout_json': hall_data['layout_json']
        }
    )
    created_halls[hall_type] = hall
    if created:
        print(f"Created {hall.name}")
    else:
        print(f"Using existing hall: {hall.name}")

# Get all movies
movies = Movie.objects.all()
if not movies:
    print("No movies found in the database")
    exit()

# Generate showtimes for the next 7 days
today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
languages = ['kg', 'ru']

# Standard time slots
standard_time_slots = [
    (10, 0),  # 10:00 AM
    (12, 30),  # 12:30 PM
    (15, 0),   # 3:00 PM
    (17, 30),  # 5:30 PM
    (20, 0),   # 8:00 PM
]

# VIP time slots
vip_time_slots = [
    (13, 0),   # 1:00 PM
    (18, 0),   # 6:00 PM
    (21, 30),  # 9:30 PM
]

# Clear existing future showtimes
Showtime.objects.filter(datetime__gte=today).delete()
print("Deleted existing future showtimes")

showtime_count = 0

# Add new showtimes
for day in range(7):
    current_date = today + timedelta(days=day)
    
    for movie in movies:
        # Add standard showtimes
        for hour, minute in standard_time_slots:
            # Skip some time slots randomly for variety
            if random.random() < 0.3:
                continue
                
            showtime_time = current_date.replace(hour=hour, minute=minute)
            language = random.choice(languages)
            
            Showtime.objects.create(
                id=uuid.uuid4(),
                movie=movie,
                hall=created_halls['standard'],
                datetime=showtime_time,
                language=language,
                price=300.00  # Standard price in KGS
            )
            showtime_count += 1
        
        # Add VIP showtimes
        for hour, minute in vip_time_slots:
            # Skip some time slots randomly for variety
            if random.random() < 0.4:
                continue
                
            showtime_time = current_date.replace(hour=hour, minute=minute)
            language = random.choice(languages)
            
            Showtime.objects.create(
                id=uuid.uuid4(),
                movie=movie,
                hall=created_halls['vip'],
                datetime=showtime_time,
                language=language,
                price=500.00  # VIP price in KGS
            )
            showtime_count += 1

print(f"Created {showtime_count} showtimes for the next 7 days") 