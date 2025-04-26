import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../api/authService';
import PageBanner from '../common/PageBanner';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.username) {
      errors.username = t('errors.fieldRequired');
    }
    
    if (!formData.email) {
      errors.email = t('errors.fieldRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('errors.invalidEmail');
    }
    
    if (!formData.first_name) {
      errors.first_name = t('errors.fieldRequired');
    }
    
    if (!formData.last_name) {
      errors.last_name = t('errors.fieldRequired');
    }
    
    if (!formData.password) {
      errors.password = t('errors.fieldRequired');
    } else if (formData.password.length < 8) {
      errors.password = t('errors.passwordTooShort');
    }
    
    if (!formData.password2) {
      errors.password2 = t('errors.fieldRequired');
    } else if (formData.password !== formData.password2) {
      errors.password2 = t('errors.passwordsDontMatch');
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await authService.register(formData);
      
      // Automatically log in after registration
      await authService.login({
        username: formData.username,
        password: formData.password,
      });
      
      navigate('/');
    } catch (err: any) {
      console.error(err);
      
      if (err.response?.data) {
        // Handle API validation errors
        const apiErrors = err.response.data;
        
        if (typeof apiErrors === 'object') {
          setFieldErrors(apiErrors);
        } else {
          setError(t('errors.somethingWentWrong'));
        }
      } else {
        setError(t('errors.somethingWentWrong'));
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <PageBanner title={t('auth.register')} />
      
      <div className="container-custom py-12">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">{t('auth.register')}</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="first_name" className="block text-gray-700 font-medium mb-2">
                  {t('auth.firstName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    fieldErrors.first_name ? 'border-red-500' : ''
                  }`}
                  disabled={loading}
                />
                {fieldErrors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.first_name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="last_name" className="block text-gray-700 font-medium mb-2">
                  {t('auth.lastName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    fieldErrors.last_name ? 'border-red-500' : ''
                  }`}
                  disabled={loading}
                />
                {fieldErrors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.last_name}</p>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                {t('auth.username')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  fieldErrors.username ? 'border-red-500' : ''
                }`}
                disabled={loading}
              />
              {fieldErrors.username && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                {t('auth.email')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  fieldErrors.email ? 'border-red-500' : ''
                }`}
                disabled={loading}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                {t('auth.password')} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  fieldErrors.password ? 'border-red-500' : ''
                }`}
                disabled={loading}
              />
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="password2" className="block text-gray-700 font-medium mb-2">
                {t('auth.confirmPassword')} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password2"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  fieldErrors.password2 ? 'border-red-500' : ''
                }`}
                disabled={loading}
              />
              {fieldErrors.password2 && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.password2}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full py-3"
              disabled={loading}
            >
              {loading ? t('common.loading') : t('auth.signUp')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 