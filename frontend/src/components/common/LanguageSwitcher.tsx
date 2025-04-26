import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        className={`px-2 py-1 text-sm rounded-md transition-colors ${
          i18n.language === 'kg'
            ? 'bg-primary text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => changeLanguage('kg')}
      >
        {t('language.kg')}
      </button>
      <button
        className={`px-2 py-1 text-sm rounded-md transition-colors ${
          i18n.language === 'ru'
            ? 'bg-primary text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => changeLanguage('ru')}
      >
        {t('language.ru')}
      </button>
    </div>
  );
};

export default LanguageSwitcher; 