export interface SnackItem {
  id: string;
  name_kg: string;
  name_ru: string;
  name_en: string;
  description_kg: string;
  description_ru: string;
  description_en: string;
  price: number;
  image: string;
  category: 'popcorn' | 'drinks' | 'snacks' | 'combo' | 'desserts';
  isPopular?: boolean;
  isSpecial?: boolean;
  isNew?: boolean;
  allergens?: string[];
}

// Sample snacks data
export const snacksData: SnackItem[] = [
  {
    id: "1",
    name_kg: "Классикалык попкорн",
    name_ru: "Классический попкорн",
    name_en: "Classic Popcorn",
    description_kg: "Биздин белгилүү таттуу жана туздуу классикалык попкорн",
    description_ru: "Наш знаменитый классический попкорн, сладкий и соленый",
    description_en: "Our famous classic popcorn, both sweet and salty",
    price: 250,
    image: "/images/snacks/classicpopcorn.png",
    category: "popcorn",
    isPopular: true
  },
  {
    id: "2",
    name_kg: "Кока-кола",
    name_ru: "Кока-кола",
    name_en: "Coca-Cola",
    description_kg: "Муздак жана сергиткич кока-кола ичимдиги",
    description_ru: "Холодный и освежающий напиток кока-кола",
    description_en: "Cold and refreshing Coca-Cola drink",
    price: 180,
    image: "/images/snacks/coca-cola.png",
    category: "drinks",
    isPopular: true
  },
  {
    id: "3",
    name_kg: "Начос сырлуу соус менен",
    name_ru: "Начос с сырным соусом",
    name_en: "Nachos with Cheese Sauce",
    description_kg: "Кытырак начос чипстери эритилген сыр соусу менен",
    description_ru: "Хрустящие чипсы начос с соусом из плавленого сыра",
    description_en: "Crispy nachos chips with melted cheese sauce",
    price: 320,
    image: "/images/snacks/nachoswithcheese.png",
    category: "snacks"
  },
  {
    id: "4",
    name_kg: "Кино комбо",
    name_ru: "Кино комбо",
    name_en: "Movie Combo",
    description_kg: "Чоң попкорн, эки ичимдик жана начос чипстери",
    description_ru: "Большой попкорн, два напитка и чипсы начос",
    description_en: "Large popcorn, two drinks, and nachos chips",
    price: 650,
    image: "/images/snacks/moviecombo.png",
    category: "combo",
    isSpecial: true,
    isPopular: true
  },
  {
    id: "5",
    name_kg: "Шоколаддуу бомба",
    name_ru: "Шоколадная бомба",
    name_en: "Chocolate Bomb",
    description_kg: "Кремли толтурулган ысык шоколаддуу десерт",
    description_ru: "Горячий шоколадный десерт с кремовой начинкой",
    description_en: "Hot chocolate dessert with creamy filling",
    price: 280,
    image: "/images/snacks/bombchocolate.png",
    category: "desserts",
    isNew: true
  },
  {
    id: "6",
    name_kg: "Жемиш чайы",
    name_ru: "Фруктовый чай",
    name_en: "Fruit Tea",
    description_kg: "Жаңы жемиштерден жасалган ароматтуу чай",
    description_ru: "Ароматный чай из свежих фруктов",
    description_en: "Aromatic tea made from fresh fruits",
    price: 200,
    image: "/images/snacks/teawithfruits.png",
    category: "drinks"
  },
  {
    id: "7",
    name_kg: "Карамель попкорн",
    name_ru: "Карамельный попкорн",
    name_en: "Caramel Popcorn",
    description_kg: "Таттуу жана жабышкак карамель соусундагы попкорн",
    description_ru: "Попкорн в сладком и липком карамельном соусе",
    description_en: "Popcorn in sweet and sticky caramel sauce",
    price: 280,
    image: "/images/snacks/caramelpopcorn.png",
    category: "popcorn",
    isPopular: true
  },
  {
    id: "8",
    name_kg: "Үй-бүлөлүк комбо",
    name_ru: "Семейное комбо",
    name_en: "Family Combo",
    description_kg: "Эки чоң попкорн, төрт ичимдик, эки начос жана бир десерт",
    description_ru: "Два больших попкорна, четыре напитка, два начос и один десерт",
    description_en: "Two large popcorns, four drinks, two nachos, and one dessert",
    price: 1200,
    image: "/images/snacks/familycombo.png",
    category: "combo",
    isSpecial: true
  }
];

// Helper functions to filter snacks by category
export const getSnacksByCategory = (category: string) => {
  return snacksData.filter(snack => snack.category === category);
};

export const getPopularSnacks = () => {
  return snacksData.filter(snack => snack.isPopular);
};

export const getSpecialOffers = () => {
  return snacksData.filter(snack => snack.isSpecial);
};

export const getNewItems = () => {
  return snacksData.filter(snack => snack.isNew);
}; 