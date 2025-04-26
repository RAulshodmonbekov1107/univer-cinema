import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageBanner from '../common/PageBanner';
import LoadingSpinner from '../common/LoadingSpinner';
import { newsService, News as NewsItem } from '../../api/newsService';

const News: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch news or use mock data
    const fetchNews = async () => {
      try {
        // Try to fetch from API
        const fetchedNews = await newsService.getNews();
        if (fetchedNews && fetchedNews.length > 0) {
          setNews(fetchedNews);
        } else {
          // Use mock data if API returns empty
          setNews(getMockNews());
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(t('common.dataNotFound'));
        setNews(getMockNews());
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentLanguage, t]);

  const getMockNews = (): NewsItem[] => {
    const currentDate = new Date();
    
    // Generate dates for the news items (recent dates)
    const date1 = new Date(currentDate);
    date1.setDate(date1.getDate() - 2);
    
    const date2 = new Date(currentDate);
    date2.setDate(date2.getDate() - 5);
    
    const date3 = new Date(currentDate);
    date3.setDate(date3.getDate() - 7);
    
    const date4 = new Date(currentDate);
    date4.setDate(date4.getDate() - 10);
    
    return [
      {
        id: '1',
        title_kg: 'Жаңы "Жездекем" фильминин премьерасы',
        title_ru: 'Премьера нового фильма "Жездекем"',
        content_kg: 'Бул апта биздин кинотеатрда "Жездекем" фильминин премьерасы өтөт. Бул фильм кыргыз элинин жашоосу жана каада-салты жөнүндө. Актёрлор менен жолугушуу да уюштурулат.',
        content_ru: 'На этой неделе в нашем кинотеатре состоится премьера фильма "Жездекем". Этот фильм о жизни и традициях кыргызского народа. Также будет организована встреча с актерами.',
        image: 'https://cdn-vk.tatar/static/image/v1/S8hNFnkZuoY1sADnLKpxI-cPfSlKYpbBZWM3hvVJ970/resizing_type:fill:1110:624:0/bg:eeeeee/ext:webp/q:95/plain/pub/1683/1683624/iblock/7eb/7ebccd3ce9a6c6eb8a8a975ec2387cf1.jpg',
        published: true,
        created_at: date1.toISOString()
      },
      {
        id: '2',
        title_kg: 'Балдар үчүн атайын көрсөтүүлөр',
        title_ru: 'Специальные показы для детей',
        content_kg: 'Жекшемби күндөрү биз балдар үчүн атайын көрсөтүүлөрдү баштайбыз. Ар бир балдар билети үчүн - попкорн белекке!',
        content_ru: 'По воскресеньям мы начинаем специальные показы для детей. За каждый детский билет - попкорн в подарок!',
        image: 'https://avatars.mds.yandex.net/get-kinopoisk-image/4774061/a2ab8b80-8fb9-4664-8ac2-a9c2d0c3b0f4/1920x',
        published: true,
        created_at: date2.toISOString()
      },
      {
        id: '3',
        title_kg: 'Кинотеатрыбыздын жаңыланышы',
        title_ru: 'Обновление нашего кинотеатра',
        content_kg: 'Биз сизге кинотеатрыбызда жаңы жабдуулар орнотулгандыгын билдиребиз. Эми фильмдер жогорку сапатта көрсөтүлөт.',
        content_ru: 'Мы рады сообщить, что в нашем кинотеатре установлено новое оборудование. Теперь фильмы показываются в еще более высоком качестве.',
        image: 'https://www.teatherm.ru/upload/iblock/2cf/8riqt91yw14ckpqm2nxlwcm0v0qnzcr9.jpg',
        published: true,
        created_at: date3.toISOString()
      },
      {
        id: '4',
        title_kg: 'Жаңы сезон: Күз 2024',
        title_ru: 'Новый сезон: Осень 2024',
        content_kg: 'Күз сезонунун жаңы фильмдерине билеттер сатууга коюлду. Бронь кылуу үчүн сайтка кириңиз же кассага кайрылыңыз.',
        content_ru: 'Билеты на новые фильмы осеннего сезона уже в продаже. Для бронирования посетите наш сайт или обратитесь в кассу.',
        image: 'https://kino-teatr.ua/public/main/films/trailer_7301.jpg',
        published: true,
        created_at: date4.toISOString()
      }
    ];
  };

  // Get the title based on language
  const getTitle = (item: NewsItem) => {
    return currentLanguage === 'ru' ? item.title_ru : item.title_kg;
  };

  // Get the content based on language
  const getContent = (item: NewsItem) => {
    return currentLanguage === 'ru' ? item.content_ru : item.content_kg;
  };

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : 'ky-KG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <PageBanner title={t('nav.news')} />
      
      <div className="container-custom py-12">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map(item => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={getTitle(item)} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src = '/images/default-news.jpg';
                    }}
                  />
                </div>
                
                <div className="p-6">
                  <div className="text-gray-500 text-sm mb-2">{formatDate(item.created_at)}</div>
                  <h3 className="text-xl font-bold mb-3">{getTitle(item)}</h3>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {getContent(item)}
                  </p>
                  
                  <Link 
                    to={`/news/${item.id}`} 
                    className="text-primary font-medium hover:underline"
                  >
                    {t('common.readMore')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News; 