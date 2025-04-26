import { Movie } from '../api/movieService';

// Sample movie data for demonstration
export const sampleMovies: Movie[] = [
  {
    id: "1",
    title_kg: "Жеңиш",
    title_ru: "Победа",
    synopsis_kg: "Айылдык жашоодо өткөн, Кыргызстандын эгемендүүлүк күрөшүнө арналган патриоттук окуя. Бул тасмада баатыр жана анын үй-бүлөсү өлкөнүн азаттыгы үчүн күрөшөт.",
    synopsis_ru: "Патриотическая история, действие которой происходит в сельской местности Кыргызстана, посвященная борьбе страны за независимость. В этом фильме герой и его семья борются за свободу своей страны.",
    trailer: "https://www.youtube.com/watch?v=example1",
    genre: "Drama",
    language: "kg",
    duration: 105,
    poster: "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    release_date: "2023-08-31",
    is_showing: true
  },
  {
    id: "2",
    title_kg: "Боз Салкын",
    title_ru: "Боз Салкын",
    synopsis_kg: "Салттык баалуулуктарды кайрадан ачкан жаш аялдын окуясы. Кыргыз маданиятын жана каада-салттарын көрсөткөн көркөм тасма.",
    synopsis_ru: "История молодой женщины, заново открывающей для себя традиционные ценности. Художественный фильм, демонстрирующий кыргызскую культуру и традиции.",
    trailer: "https://www.youtube.com/watch?v=example2",
    genre: "Art-house",
    language: "kg",
    duration: 120,
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    release_date: "2022-05-15",
    is_showing: true
  },
  {
    id: "3",
    title_kg: "Шамбала",
    title_ru: "Шамбала",
    synopsis_kg: "Табышмактуу Шамбала дүйнөсүн издеген жаш баланын окуясы. Тасма Чыңгыз Айтматовдун чыгармасына негизделген.",
    synopsis_ru: "История мальчика, ищущего таинственный мир Шамбалы. Фильм основан на произведении Чингиза Айтматова.",
    trailer: "https://www.youtube.com/watch?v=example3",
    genre: "Mystery",
    language: "ru",
    duration: 90,
    poster: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    release_date: "2023-02-10",
    is_showing: true
  },
  {
    id: "4",
    title_kg: "Бүркүтчү кыз",
    title_ru: "Девочка-сокольница",
    synopsis_kg: "Салттык эркектердин ишин алып жүргөн 13 жаштагы кыргыз кызы жөнүндө документалдык тасма. Бул фильм кыздардын салттык ролдорду кантип өзгөртө алаарын көрсөтөт.",
    synopsis_ru: "Документальный фильм о 13-летней кыргызской девочке, занимающейся традиционно мужским делом. Этот фильм показывает, как девочки могут изменить традиционные роли.",
    trailer: "https://www.youtube.com/watch?v=example4",
    genre: "Documentary",
    language: "en",
    duration: 87,
    poster: "https://images.unsplash.com/photo-1562117532-085135df9311?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    release_date: "2021-11-22",
    is_showing: true
  },
  {
    id: "5",
    title_kg: "Курманжан Датка",
    title_ru: "Курманжан Датка: Королева гор",
    synopsis_kg: "XIX кылымдагы легендарлуу Алай ханышасы болгон Курманжан Датканын өмүр баяны. Кыргыз тарыхындагы маанилүү учурларды камтыган эпикалык тасма.",
    synopsis_ru: "Биография Курманджан Датки, ставшей легендарной правительницей Алая в XIX веке. Эпический фильм, охватывающий важные моменты кыргызской истории.",
    trailer: "https://www.youtube.com/watch?v=example5",
    genre: "Historical",
    language: "kg",
    duration: 125,
    poster: "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    release_date: "2020-08-31",
    is_showing: true
  },
  {
    id: "6",
    title_kg: "Кентавр",
    title_ru: "Кентавр",
    synopsis_kg: "Айылда жашаган китеп сүйүүчү адам жөнүндөгү тасма. Ал өзүнүн жашоосун өзгөртүү үчүн Кыргыз элдик мифологиясына кайрылат.",
    synopsis_ru: "Фильм о сельском книголюбе, который обращается к кыргызской народной мифологии, чтобы изменить свою жизнь.",
    trailer: "https://www.youtube.com/watch?v=example6",
    genre: "Drama",
    language: "kg",
    duration: 110,
    poster: "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    release_date: "2024-03-20",
    is_showing: false
  },
  {
    id: "7",
    title_kg: "Супер Атаке",
    title_ru: "Супер Атаке",
    synopsis_kg: "Баласына жакшы жашоо курууну каалаган жесир атанын окуясы. Жөнөкөй адамдарды чагылдырган тамашалуу комедия.",
    synopsis_ru: "История овдовевшего отца, который хочет построить лучшую жизнь для своего сына. Веселая комедия, отражающая жизнь простых людей.",
    trailer: "https://www.youtube.com/watch?v=example7",
    genre: "Comedy",
    language: "kg",
    duration: 95,
    poster: "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    release_date: "2024-06-15",
    is_showing: false
  }
];

// Sample movies currently showing in theaters
export const nowShowingMovies = sampleMovies.filter(movie => movie.is_showing);

// Sample upcoming movies
export const comingSoonMovies = sampleMovies.filter(movie => !movie.is_showing);

// Sample movies for featured carousel
export const featuredMovies = sampleMovies.slice(0, 5); 