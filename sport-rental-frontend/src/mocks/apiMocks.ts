// Мок данных для пользователей
export const USER_MOCK = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Иван',
  lastName: 'Иванов',
  phone: '+7 (999) 999-99-99',
  role: 'user',
  token: 'fake-jwt-token'
};

export const ADMIN_MOCK = {
  id: 2,
  email: 'admin@example.com',
  firstName: 'Админ',
  lastName: 'Админов',
  phone: '+7 (888) 888-88-88',
  role: 'admin',
  token: 'fake-admin-jwt-token'
};

// Мок данных для категорий
export const CATEGORIES_MOCK = [
  {
    id: 1,
    name: 'Лыжи',
    description: 'Все для катания на лыжах',
    imageUrl: 'https://via.placeholder.com/200x200'
  },
  {
    id: 2,
    name: 'Сноуборды',
    description: 'Все для сноубординга',
    imageUrl: 'https://via.placeholder.com/200x200'
  },
  {
    id: 3,
    name: 'Коньки',
    description: 'Все для катания на льду',
    imageUrl: 'https://via.placeholder.com/200x200'
  }
];

// Мок данных для продуктов
export const PRODUCTS_MOCK = [
  {
    id: 1,
    name: 'Горные лыжи Atomic',
    description: 'Профессиональные горные лыжи для опытных лыжников',
    price: 1500,
    categoryId: 1,
    imageUrl: 'https://via.placeholder.com/300x200',
    available: true
  },
  {
    id: 2,
    name: 'Сноуборд Burton',
    description: 'Универсальный сноуборд для фрирайда',
    price: 2000,
    categoryId: 2,
    imageUrl: 'https://via.placeholder.com/300x200',
    available: true
  },
  {
    id: 3,
    name: 'Коньки фигурные',
    description: 'Профессиональные фигурные коньки',
    price: 800,
    categoryId: 3,
    imageUrl: 'https://via.placeholder.com/300x200',
    available: false
  }
];

// Мок данных для корзины
export const CART_MOCK = {
  id: 1,
  userId: 1,
  items: [
    {
      id: 1,
      productId: 1,
      days: 3,
      price: 1500,
      total: 4500
    },
    {
      id: 2,
      productId: 2,
      days: 2,
      price: 2000,
      total: 4000
    }
  ],
  totalAmount: 8500
};

// Мок данных для заказов
export const ORDERS_MOCK = [
  {
    id: 1,
    userId: 1,
    items: [
      {
        productId: 1,
        days: 3,
        price: 1500,
        total: 4500
      }
    ],
    status: 'pending',
    totalAmount: 4500,
    rentStart: '2024-03-25',
    rentEnd: '2024-03-28',
    createdAt: '2024-03-20',
    customerInfo: {
      firstName: 'Иван',
      lastName: 'Иванов',
      email: 'ivan@example.com',
      phone: '+7 (999) 123-45-67',
      address: 'ул. Ленина, 10, кв. 5',
      city: 'Москва',
      postalCode: '123456'
    }
  },
  {
    id: 2,
    userId: 1,
    items: [
      {
        productId: 2,
        days: 5,
        price: 2000,
        total: 10000
      }
    ],
    status: 'completed',
    totalAmount: 10000,
    rentStart: '2024-03-15',
    rentEnd: '2024-03-20',
    createdAt: '2024-03-14',
    customerInfo: {
      firstName: 'Иван',
      lastName: 'Иванов',
      email: 'ivan@example.com',
      phone: '+7 (999) 123-45-67'
    }
  },
  {
    id: 3,
    userId: 1,
    items: [
      {
        productId: 3,
        days: 2,
        price: 800,
        total: 1600
      },
      {
        productId: 1,
        days: 2,
        price: 1500,
        total: 3000
      }
    ],
    status: 'active',
    totalAmount: 4600,
    rentStart: '2024-04-01',
    rentEnd: '2024-04-03',
    createdAt: '2024-03-28',
    customerInfo: {
      firstName: 'Иван',
      lastName: 'Иванов',
      email: 'ivan@example.com',
      phone: '+7 (999) 123-45-67',
      address: 'ул. Пушкина, 15, кв. 42',
      city: 'Санкт-Петербург',
      postalCode: '198765'
    }
  }
];

// Мок данных для статистики админ-панели
export const DASHBOARD_STATS_MOCK = {
  totalOrders: 150,
  activeOrders: 45,
  totalRevenue: 250000,
  popularProducts: [
    {
      id: 1,
      name: 'Горные лыжи Atomic',
      rentCount: 25,
      imageUrl: 'https://via.placeholder.com/100x100',
      category: 'Лыжи'
    },
    {
      id: 2,
      name: 'Сноуборд Burton',
      rentCount: 18,
      imageUrl: 'https://via.placeholder.com/100x100',
      category: 'Сноуборды'
    },
    {
      id: 3,
      name: 'Коньки фигурные',
      rentCount: 15,
      imageUrl: 'https://via.placeholder.com/100x100',
      category: 'Коньки'
    }
  ],
  ordersByStatus: {
    pending: 30,
    active: 45,
    completed: 65,
    cancelled: 10
  }
};

// Мок данных для отчета о доходах
export const REVENUE_REPORT_MOCK = {
  daily: [
    { date: '2024-03-19', amount: 15000 },
    { date: '2024-03-20', amount: 18000 },
    { date: '2024-03-21', amount: 12000 }
  ],
  total: 45000
}; 