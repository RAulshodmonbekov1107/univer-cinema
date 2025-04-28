import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import SnackSelection from './components/pages/SnackSelection';
import { BookingProvider } from './contexts/BookingContext';

// Initialize i18n
import './utils/i18n';

// Language context to force rerenders on language change
export const LanguageContext = React.createContext('');

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = React.useState(i18n.language);
  
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(i18n.language);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  
  return (
    <LanguageContext.Provider value={language}>
      {children}
    </LanguageContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <LanguageProvider>
          <BookingProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/movies/:id" element={<MovieDetails />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/booking/:id" element={<Booking />} />
                <Route path="/snack-selection" element={<SnackSelection />} />
                <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                <Route path="/about" element={<About />} />
                <Route path="/snacks" element={<Snacks />} />
                <Route path="/news" element={<News />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contacts" element={<Contacts />} />
              </Routes>
            </Layout>
          </BookingProvider>
        </LanguageProvider>
      </Suspense>
    </Router>
  );
}

export default App;
