# Univer Cinema

A professional cinema website for Univer Cinema in Naryn, Kyrgyzstan. The website allows users to view films, book tickets, order snacks, manage their profiles, and access multilingual content (Kyrgyz and Russian).

## Features

- Browse movies (now showing and coming soon)
- View movie details, trailers, and showtimes
- Book tickets with interactive seat selection
- Order snacks along with tickets
- User accounts with ticket history
- Multilingual support (Kyrgyz and Russian)
- News and gallery sections
- Contact and about pages

## Tech Stack

### Frontend
- React
- TypeScript
- TailwindCSS
- React Router
- Axios
- i18next for translations

### Backend
- Django
- Django REST Framework
- JWT Authentication
- PostgreSQL (configured but SQLite used in development)

## Development Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```
   python manage.py migrate
   ```

5. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

### Starting Both Servers Together
Use the provided script to start both frontend and backend servers:
```
./start-dev.sh
```

## Project Structure

### Backend
- `cinema_project/` - Django project settings
- `cinema/` - Main Django app
  - `models.py` - Database models
  - `views.py` - API views
  - `serializers.py` - REST framework serializers
  - `urls.py` - API URL routing

### Frontend
- `src/components/` - React components
  - `layout/` - Layout components (Header, Footer)
  - `pages/` - Page components
  - `common/` - Reusable UI components
- `src/api/` - API service modules
- `src/utils/` - Utility functions
- `src/locales/` - Translation files

## API Endpoints

- `/api/movies/` - Movie listing and details
- `/api/showtimes/` - Movie showtimes
- `/api/showtimes/<id>/seats/` - Available seats for a showtime
- `/api/snacks/` - Food and beverage options
- `/api/bookings/` - Ticket booking
- `/api/news/` - Cinema news
- `/api/gallery/` - Photo gallery
- `/api/auth/register/` - User registration
- `/api/auth/me/` - User profile
- `/api/token/` - JWT token authentication
- `/api/token/refresh/` - JWT token refresh

## License

This project is licensed under the MIT License. 