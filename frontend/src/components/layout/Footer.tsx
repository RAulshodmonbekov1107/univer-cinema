import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold text-primary mb-4">{t('app.name')}</h3>
            <p className="text-gray-400 mb-4">{t('app.tagline')}</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                <FaFacebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                <FaInstagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                <FaTwitter size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('nav.home')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/movies" className="text-gray-400 hover:text-primary">
                  {t('nav.movies')}
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-gray-400 hover:text-primary">
                  {t('nav.schedule')}
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-400 hover:text-primary">
                  {t('nav.news')}
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-primary">
                  {t('nav.gallery')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary">
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.termsAndConditions')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-primary">
                  {t('footer.termsAndConditions')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-primary">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-gray-400 hover:text-primary">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('nav.contacts')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-primary mt-1 mr-2" />
                <span className="text-gray-400">
                  123 Cinema Street, Naryn, Kyrgyzstan
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-primary mr-2" />
                <a href="tel:+996700123456" className="text-gray-400 hover:text-primary">
                  +996 700 123 456
                </a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-primary mr-2" />
                <a href="mailto:info@univercinema.kg" className="text-gray-400 hover:text-primary">
                  info@univercinema.kg
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center">
          <p className="text-gray-500">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 