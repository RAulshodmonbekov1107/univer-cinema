import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import MovieDetails from './components/pages/MovieDetails';
import Movies from './components/pages/Movies';
import Schedule from './components/pages/Schedule';
import Booking from './components/pages/Booking';
import BookingConfirmation from './components/pages/BookingConfirmation';
import About from './components/pages/About';
import Snacks from './components/pages/Snacks';
import News from './components/pages/News';
import Gallery from './components/pages/Gallery';
import Contacts from './components/pages/Contacts';
import LoadingSpinner from './components/common/LoadingSpinner';
import Layout from './components/layout/Layout';

// Initialize i18n
import './utils/i18n';

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/about" element={<About />} />
            <Route path="/snacks" element={<Snacks />} />
            <Route path="/news" element={<News />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contacts" element={<Contacts />} />
          </Routes>
        </Layout>
      </Suspense>
    </Router>
  );
}

export default App;
