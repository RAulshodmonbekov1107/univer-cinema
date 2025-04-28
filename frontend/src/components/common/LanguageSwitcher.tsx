import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="flex rounded-md overflow-hidden shadow-sm border border-gray-200">
      <button
        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
          i18n.language === 'kg'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => changeLanguage('kg')}
        aria-label="Switch to Kyrgyz language"
      >
        KG
      </button>
      <button
        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
          i18n.language === 'ru'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => changeLanguage('ru')}
        aria-label="Switch to Russian language"
      >
        RU
      </button>
    </div>
  );
};

export default LanguageSwitcher; 