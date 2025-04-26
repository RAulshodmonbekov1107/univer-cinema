import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import PageBanner from '../common/PageBanner';
import Button from '../common/Button';

const Contacts: React.FC = () => {
  const { t } = useTranslation();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !message) {
      setError(t('errors.fillAllFields'));
      return;
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError(t('errors.invalidEmail'));
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setError(null);
      // Reset form
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };
  
  return (
    <div>
      <PageBanner 
        title={t('nav.contacts')} 
        overlay="dark"
      />
      
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Univer Cinema</h2>
            <p className="text-gray-700 mb-8">
              {t('contacts.description')}
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="mr-4 text-primary">
                  <FaMapMarkerAlt size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('contacts.address')}</h3>
                  <p className="text-gray-700">123 Manas Street, Naryn, Kyrgyzstan</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 text-primary">
                  <FaPhone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('contacts.phone')}</h3>
                  <p className="text-gray-700">+996 (555) 123-456</p>
                  <p className="text-gray-700">+996 (312) 123-456</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 text-primary">
                  <FaEnvelope size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('contacts.email')}</h3>
                  <p className="text-gray-700">info@univercinema.kg</p>
                  <p className="text-gray-700">support@univercinema.kg</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 text-primary">
                  <FaClock size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('contacts.workingHours')}</h3>
                  <p className="text-gray-700">{t('contacts.weekdays')}: 10:00 - 22:00</p>
                  <p className="text-gray-700">{t('contacts.weekends')}: 09:00 - 23:00</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4">{t('contacts.followUs')}</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  <FaFacebook size={20} />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  <FaInstagram size={20} />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  <FaTwitter size={20} />
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            {submitted ? (
              <div className="text-center p-6">
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <h3 className="text-2xl font-bold mb-4">{t('contacts.messageSent')}</h3>
                <p className="text-gray-700 mb-6">
                  {t('contacts.thankYouMessage')}
                </p>
                <Button 
                  variant="primary"
                  onClick={() => setSubmitted(false)}
                >
                  {t('contacts.sendAnother')}
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">{t('contacts.getInTouch')}</h2>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      {t('contacts.name')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      {t('contacts.email')}
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      {t('contacts.message')}
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-32"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <Button 
                    variant="primary"
                    type="submit"
                    className="w-full"
                  >
                    {t('contacts.send')}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
        
        {/* Google Maps Embed */}
        <div className="rounded-lg overflow-hidden shadow-md">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d69358.7430359829!2d75.9894833032301!3d41.42785079151517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30a02d178cd0dbc5%3A0x1e23e0a6eda47f95!2sNaryn%2C%20Kyrgyzstan!5e0!3m2!1sen!2sus!4v1682855692593!5m2!1sen!2sus" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Univer Cinema Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contacts; 