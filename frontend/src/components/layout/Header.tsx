import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { authService } from '../../api/authService';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const isAuthenticated = authService.isAuthenticated();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };
  
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };
  
  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/movies', label: t('nav.movies') },
    { path: '/schedule', label: t('nav.schedule') },
    { path: '/snacks', label: t('nav.snacks') },
    { path: '/news', label: t('nav.news') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/contacts', label: t('nav.contacts') },
    { path: '/about', label: t('nav.about') },
  ];
  
  return (
    <header className="bg-white shadow-md">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">{t('app.name')}</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-gray-700 hover:text-primary transition-colors ${
                  location.pathname === link.path ? 'text-primary font-medium' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <LanguageSwitcher />
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors"
                >
                  <FaUser />
                  <span>{t('nav.profile')}</span>
                </button>
                
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-20">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      {t('nav.profile')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="mr-2" />
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-primary">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn-primary">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 hover:text-primary"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-gray-700 hover:text-primary transition-colors ${
                    location.pathname === link.path ? 'text-primary font-medium' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="block mb-4 text-gray-700 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.profile')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-gray-700 hover:text-primary"
                    >
                      <FaSignOutAlt className="mr-2" />
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary inline-block text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.register')}
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="pt-4">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 