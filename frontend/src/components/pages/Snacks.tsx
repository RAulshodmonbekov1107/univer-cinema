import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaStar, FaFire, FaShoppingCart } from 'react-icons/fa';
import { snacksData, getPopularSnacks, getSpecialOffers, getSnacksByCategory, SnackItem } from '../../data/snacksData';
import PageBanner from '../common/PageBanner';

const Snacks: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [addedToCart, setAddedToCart] = useState<string[]>([]);
  
  // Function to get the name in the current language
  const getName = (item: SnackItem) => {
    switch(currentLang) {
      case 'kg': return item.name_kg;
      case 'ru': return item.name_ru;
      default: return item.name_en;
    }
  };
  
  // Function to get the description in the current language
  const getDescription = (item: SnackItem) => {
    switch(currentLang) {
      case 'kg': return item.description_kg;
      case 'ru': return item.description_ru;
      default: return item.description_en;
    }
  };
  
  // Filter snacks based on category
  const getFilteredSnacks = () => {
    if (activeCategory === 'all') return snacksData;
    if (activeCategory === 'popular') return getPopularSnacks();
    if (activeCategory === 'special') return getSpecialOffers();
    return getSnacksByCategory(activeCategory);
  };
  
  const handleAddToCart = (id: string) => {
    setAddedToCart(prev => [...prev, id]);
    
    // Reset notification after 2 seconds
    setTimeout(() => {
      setAddedToCart(prev => prev.filter(itemId => itemId !== id));
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PageBanner title={t('nav.snacks')} />
      
      <div className="container-custom py-10">
        {/* Special Offers Banner */}
        <div className="bg-gradient-to-r from-amber-600 to-red-600 rounded-xl p-6 mb-10 shadow-lg text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('snacks.specialOffer')}</h2>
              <p className="text-lg opacity-90 mb-4">{t('snacks.comboOffer')}</p>
              <button className="bg-white text-red-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
                {t('snacks.orderNow')}
              </button>
            </div>
            <div className="mt-6 md:mt-0">
              <img 
                src="/images/snacks/moviecombo.png" 
                alt="Special Combo" 
                className="w-64 h-auto object-cover rounded-lg shadow-md"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Combo+Pack';
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Popular Items */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('snacks.popularItems')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getPopularSnacks().slice(0, 4).map(snack => (
              <div key={snack.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={snack.image} 
                    alt={getName(snack)} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(getName(snack))}`;
                    }}
                  />
                  {snack.isNew && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {t('snacks.new')}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{getName(snack)}</h3>
                  <p className="text-gray-600 text-sm mb-3">{getDescription(snack)}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{snack.price} сом</span>
                    <button 
                      onClick={() => handleAddToCart(snack.id)}
                      className="bg-primary text-white px-4 py-2 rounded-full flex items-center hover:bg-primary-dark transition-colors"
                    >
                      <FaShoppingCart className="mr-2" />
                      {t('snacks.add')}
                    </button>
                  </div>
                </div>
                
                {/* Added to cart notification */}
                {addedToCart.includes(snack.id) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-center py-2 animate-fade-in">
                    {t('snacks.addedToOrder')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        
        {/* Menu Tabs and Items */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('snacks.menu')}</h2>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeCategory === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('snacks.allItems')}
            </button>
            <button
              onClick={() => setActiveCategory('popular')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                activeCategory === 'popular' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaStar className="mr-2" />
              {t('snacks.popularItems')}
            </button>
            <button
              onClick={() => setActiveCategory('special')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                activeCategory === 'special' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaFire className="mr-2" />
              {t('snacks.specialOffer')}
            </button>
            <button
              onClick={() => setActiveCategory('popcorn')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeCategory === 'popcorn' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('snacks.popcorn')}
            </button>
            <button
              onClick={() => setActiveCategory('drinks')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeCategory === 'drinks' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('snacks.drinks')}
            </button>
            <button
              onClick={() => setActiveCategory('snacks')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeCategory === 'snacks' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('snacks.snacks')}
            </button>
            <button
              onClick={() => setActiveCategory('combo')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeCategory === 'combo' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('snacks.combo')}
            </button>
            <button
              onClick={() => setActiveCategory('desserts')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeCategory === 'desserts' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('snacks.desserts')}
            </button>
          </div>
          
          {/* Snack Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getFilteredSnacks().map(snack => (
              <div key={snack.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={snack.image} 
                    alt={getName(snack)} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(getName(snack))}`;
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-lg mb-1">{getName(snack)}</h3>
                    {snack.isNew && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        {t('snacks.new')}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{getDescription(snack)}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{snack.price} сом</span>
                    <button 
                      onClick={() => handleAddToCart(snack.id)}
                      className="bg-primary text-white px-4 py-2 rounded-full flex items-center hover:bg-primary-dark transition-colors"
                    >
                      <FaShoppingCart className="mr-2" />
                      {t('snacks.addToOrder')}
                    </button>
                  </div>
                </div>
                
                {/* Category badge */}
                <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-70 text-white px-2 py-1 rounded-lg text-xs">
                  {t(`snacks.${snack.category}`)}
                </div>
                
                {/* Added to cart notification */}
                {addedToCart.includes(snack.id) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-center py-2 animate-fade-in">
                    {t('snacks.addedToOrder')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        
        {/* Information Sections */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">{t('snacks.howToOrder')}</h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Select the items you want to order</li>
              <li>Click "Add to Order" for each item</li>
              <li>Review your order in the cart</li>
              <li>Proceed to checkout</li>
              <li>Pick up your order at the counter using your order number</li>
            </ol>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">{t('snacks.allergyInfo')}</h3>
            <p className="text-gray-700 mb-4">
              Our food may contain or come into contact with common allergens such as:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Peanuts and tree nuts</li>
              <li>Wheat and gluten</li>
              <li>Milk and dairy products</li>
              <li>Eggs</li>
              <li>Soy</li>
            </ul>
            <p className="mt-4 text-gray-700">
              Please inform our staff of any allergies or dietary requirements.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Snacks; 