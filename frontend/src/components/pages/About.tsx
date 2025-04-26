import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaTheaterMasks, FaUsers, FaBuilding, FaHistory, FaVideo, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import PageBanner from '../common/PageBanner';

const About: React.FC = () => {
  const { t } = useTranslation();
  
  // Animation classes
  const fadeIn = "animate-fade-in";
  const slideUp = "animate-slide-up";
  
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Азамат Султанов',
      position: 'Директор',
      bio: 'Более 15 лет опыта в киноиндустрии, ранее управлял сетью кинотеатров в Бишкеке.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 2,
      name: 'Айгуль Сатарова',
      position: 'Маркетолог',
      bio: 'Специалист по цифровому маркетингу с опытом работы в крупных брендах Кыргызстана.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 3,
      name: 'Тимур Алиев',
      position: 'Технический директор',
      bio: 'Эксперт по аудио-визуальным технологиям, внедряет инновации для лучшего кинопоказа.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 4,
      name: 'Наргиза Омурова',
      position: 'Менеджер по обслуживанию',
      bio: 'Отвечает за высокий уровень сервиса и комфорт наших посетителей.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PageBanner title={t('nav.about')} />
      
      {/* Our Story */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/2 relative">
              <img 
                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Cinema interior" 
                className="rounded-xl shadow-xl w-full h-auto object-cover"
              />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex items-center mb-4">
                <FaHistory className="text-primary text-2xl mr-3" />
                <h2 className="text-3xl font-bold">{t('about.ourStory')}</h2>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Univer Cinema начал свою работу в 2020 году с целью предоставления высококачественного кинематографического опыта жителям Нарына. С момента основания наш кинотеатр стал культурным центром города, предлагая не только последние голливудские блокбастеры, но и богатое наследие кыргызского кинематографа.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Мы гордимся тем, что являемся первым современным кинотеатром в регионе, оснащенным новейшими технологиями кинопоказа и звука. Наша миссия - делать киноискусство доступным для всех, обогащая культурную жизнь Нарына через магию кино.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="text-primary text-2xl mb-2">15+</div>
                  <div className="text-gray-600">Фильмов каждый месяц</div>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="text-primary text-2xl mb-2">2</div>
                  <div className="text-gray-600">Современных зала</div>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="text-primary text-2xl mb-2">30k+</div>
                  <div className="text-gray-600">Довольных зрителей</div>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="text-primary text-2xl mb-2">100%</div>
                  <div className="text-gray-600">Комфорт и качество</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-16 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-primary/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-20 w-60 h-60 bg-blue-500/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center mb-4">
              <FaTheaterMasks className="text-primary text-2xl mr-3" />
              <h2 className="text-3xl font-bold">{t('about.ourMission')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Наша миссия - создавать пространство, где жители Нарына могут погрузиться в волшебный мир кино, 
              наслаждаясь высочайшим качеством показа и комфортной атмосферой. Мы стремимся стать культурным 
              центром региона, продвигая как мировое, так и отечественное кинематографическое искусство.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 p-6 rounded-xl transition-transform hover:transform hover:scale-105">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <FaVideo className="text-primary text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Качество показа</h3>
              <p className="text-gray-400">
                Мы инвестируем в новейшие технологии, чтобы обеспечить непревзойденное качество изображения и звука.
              </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl transition-transform hover:transform hover:scale-105">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <FaUsers className="text-primary text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Доступность</h3>
              <p className="text-gray-400">
                Мы стремимся сделать кино доступным для всех, предлагая разнообразное содержание и гибкую ценовую политику.
              </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl transition-transform hover:transform hover:scale-105">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <FaBuilding className="text-primary text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Развитие культуры</h3>
              <p className="text-gray-400">
                Мы продвигаем кыргызское кино, проводим тематические показы и фестивали, вносим вклад в культурное наследие.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className={`py-16 ${fadeIn}`}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <FaUsers className="text-primary text-2xl mr-3" />
              <h2 className="text-3xl font-bold">{t('about.ourTeam')}</h2>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Наша команда профессионалов, объединенных любовью к кино, 
              делает все возможное, чтобы ваш поход в кино стал незабываемым.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={member.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:transform hover:scale-105 animate-delay-${index * 200}`}
              >
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                  <div className="text-primary font-medium mb-3">{member.position}</div>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Facilities */}
      <section className="py-16 bg-gray-100">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <FaBuilding className="text-primary text-2xl mr-3" />
              <h2 className="text-3xl font-bold">{t('about.ourFacilities')}</h2>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Univer Cinema предлагает современные, комфортные залы с передовыми технологиями 
              для исключительных впечатлений от просмотра.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className={`${slideUp} animate-delay-100`}>
              <img 
                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Cinema hall" 
                className="rounded-xl shadow-lg w-full h-auto mb-6" 
              />
              <h3 className="text-xl font-bold mb-3">Современные залы</h3>
              <p className="text-gray-600">
                Наши залы оборудованы комфортными креслами с оптимальным расстоянием до экрана, 
                обеспечивая идеальный обзор с любого места. Каждый зал оснащен передовой системой 
                вентиляции и кондиционирования для поддержания комфортной атмосферы.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">4K проекция</span>
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">Комфортные кресла</span>
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">Идеальный обзор</span>
              </div>
            </div>
            
            <div className={`${slideUp} animate-delay-300`}>
              <img 
                src="https://images.unsplash.com/photo-1630395822970-acd6a28ecfb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Cinema snacks bar" 
                className="rounded-xl shadow-lg w-full h-auto mb-6" 
              />
              <h3 className="text-xl font-bold mb-3">Уютный кинобар</h3>
              <p className="text-gray-600">
                Наш кинобар предлагает широкий выбор закусок и напитков, которые дополнят 
                ваше киновпечатление. От традиционного попкорна до эксклюзивных коктейлей - 
                мы заботимся о том, чтобы ваш визит был максимально приятным.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">Разнообразное меню</span>
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">Свежие продукты</span>
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">Быстрое обслуживание</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Information */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 shrink-0">
                <FaMapMarkerAlt className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">{t('about.location')}</h3>
                <p className="text-gray-600">
                  ул. Ленина 18, г. Нарын, 722600, Кыргызская Республика
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 shrink-0">
                <FaPhone className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">{t('about.contactUs')}</h3>
                <p className="text-gray-600">
                  +996 (700) 123 456<br />
                  info@univercinema.kg
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 shrink-0">
                <FaEnvelope className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">{t('about.workingHours')}</h3>
                <p className="text-gray-600">
                  Понедельник - Пятница: 10:00 - 23:00<br />
                  Суббота - Воскресенье: 9:00 - 00:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 