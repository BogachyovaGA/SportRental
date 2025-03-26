import { ORDERS_MOCK, DASHBOARD_STATS_MOCK, REVENUE_REPORT_MOCK, PRODUCTS_MOCK } from '../../mocks/apiMocks';

//Вспомогательная функция для имитации задержки сервера
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/*
 * Определяем возможные статусы заказа
 * pending - ожидает обработки
 * active - активный заказ
 * completed - завершенный заказ
 * cancelled - отмененный заказ
 */
type OrderStatus = 'pending' | 'active' | 'completed' | 'cancelled';

//Интерфейс для фильтрации заказов
interface OrderFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
}

// Локальное хранилище для заказов
let mockOrders = [...ORDERS_MOCK];

// Интерфейс для элемента заказа
interface OrderItem {
  productId: number;
  days: number;
  price: number;
  total: number;
}

// Интерфейс для создания заказа
interface CreateOrderData {
  rentStart: string;
  rentEnd: string;
  items: OrderItem[];
  customerInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    postalCode?: string;
  };
}

// Интерфейс заказа
interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  rentStart: string;
  rentEnd: string;
  createdAt: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    postalCode?: string;
  };
}

//Получает все заказы с возможностью фильтрации
export const mockGetAllOrders = async (filters?: OrderFilters) => {
  await delay(1000);
  let filteredOrders = [...mockOrders];

  // Фильтрация по статусу
  if (filters?.status) {
    filteredOrders = filteredOrders.filter(order => order.status === filters.status);
  }

  // Фильтрация по начальной дате
  if (filters?.startDate) {
    filteredOrders = filteredOrders.filter(order => order.rentStart >= filters.startDate!);
  }

  // Фильтрация по конечной дате
  if (filters?.endDate) {
    filteredOrders = filteredOrders.filter(order => order.rentEnd <= filters.endDate!);
  }

  return filteredOrders;
};

/**
 * Получает список всех заказов пользователя
 * @returns Promise с массивом заказов
 */
export const mockGetOrders = async () => {
  await delay(1000); // Имитация задержки сервера
  
  // Фильтруем только заказы текущего пользователя
  // В реальном приложении id пользователя брался бы из авторизационных данных
  const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : 1;
  return mockOrders.filter(order => order.userId === userId);
};

/**
 * Получает детали конкретного заказа по его ID
 * @param orderId ID заказа
 * @returns Promise с деталями заказа
 */
export const mockGetOrderById = async (orderId: number) => {
  await delay(800); // Имитация задержки сервера
  
  const order = mockOrders.find(order => order.id === orderId);
  if (!order) {
    throw new Error('Заказ не найден');
  }
  
  return order;
};

/**
 * Создает новый заказ
 * @param orderData Данные для создания заказа
 * @returns Promise с созданным заказом
 */
export const mockCreateOrder = async (orderData: CreateOrderData) => {
  await delay(1500); // Имитация задержки сервера
  
  // В реальном приложении id пользователя брался бы из авторизационных данных
  const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : 1;
  
  // Генерируем новый id заказа
  const orderId = mockOrders.length > 0 
    ? Math.max(...mockOrders.map(order => order.id)) + 1 
    : 1;
  
  // Подготавливаем элементы заказа
  const orderItems = orderData.items.map(item => ({
    productId: item.productId,
    days: item.days,
    price: item.price || 1000, // Используем предоставленную цену или значение по умолчанию
    total: item.total || (item.price || 1000) * item.days
  }));
  
  // Рассчитываем общую сумму заказа
  const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);
  
  // Подготавливаем основу заказа
  const order: any = {
    id: orderId,
    userId: userId,
    items: orderItems,
    status: 'pending',
    totalAmount: totalAmount,
    rentStart: orderData.rentStart,
    rentEnd: orderData.rentEnd,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  // Добавляем информацию о клиенте, если она есть
  if (orderData.customerInfo) {
    order.customerInfo = {
      firstName: orderData.customerInfo.firstName,
      lastName: orderData.customerInfo.lastName,
      email: orderData.customerInfo.email,
      phone: orderData.customerInfo.phone
    };
    
    // Добавляем информацию об адресе, если она есть
    if (orderData.customerInfo.address && orderData.customerInfo.city && orderData.customerInfo.postalCode) {
      order.customerInfo.address = orderData.customerInfo.address;
      order.customerInfo.city = orderData.customerInfo.city;
      order.customerInfo.postalCode = orderData.customerInfo.postalCode;
    }
  } else {
    // Если информации о клиенте нет, добавляем пустые поля
    order.customerInfo = {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    };
  }
  
  // Добавляем заказ в массив заказов
  mockOrders.push(order);
  
  return order;
};

/**
 * Обновляет статус заказа
 * @param orderId ID заказа
 * @param status Новый статус
 * @returns Promise с обновленным заказом
 */
export const mockUpdateOrderStatus = async (orderId: number, status: 'pending' | 'active' | 'completed' | 'cancelled') => {
  await delay(1000); // Имитация задержки сервера
  
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) {
    throw new Error('Заказ не найден');
  }
  
  // Обновляем статус
  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    status
  };
  
  return mockOrders[orderIndex];
};

/**
 * Отменяет заказ
 * @param orderId ID заказа
 * @returns Promise с результатом операции
 */
export const mockCancelOrder = async (orderId: number) => {
  await delay(1000); // Имитация задержки сервера
  
  return mockUpdateOrderStatus(orderId, 'cancelled');
};

//Обновляет даты аренды заказа
export const mockUpdateOrderDates = async (orderId: number, dates: { rentStart: string; rentEnd: string }) => {
  await delay(1000);
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) throw new Error('Заказ не найден');
  
  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    rentStart: dates.rentStart,
    rentEnd: dates.rentEnd
  };
  return mockOrders[orderIndex];
};

/**
 * Получает список заказов для текущего пользователя
 * @returns Promise с массивом заказов
 */
export const mockGetUserOrders = async (): Promise<any[]> => {
  await delay(1000); // Имитация задержки сервера
  
  // В реальном приложении id пользователя брался бы из авторизационных данных
  const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : 1;
  
  // Фильтруем заказы текущего пользователя
  const userOrders = ORDERS_MOCK.filter(order => order.userId === userId);
  
  // Преобразуем в формат для UI
  return userOrders.map(order => {
    // В реальном приложении данные о продуктах запрашивались бы из API
    const orderItems = order.items.map(item => {
      // Находим товар в моковых данных или создаем заглушку
      const product = PRODUCTS_MOCK.find((p) => p.id === item.productId) || {
        id: item.productId,
        name: `Товар #${item.productId}`,
        imageUrl: 'https://via.placeholder.com/80',
        price: item.price
      };
      
      return {
        id: Math.random(), // В реальном API было бы настоящее id
        productId: item.productId,
        days: item.days,
        pricePerDay: item.price,
        product: {
          name: product.name,
          image: 'imageUrl' in product ? product.imageUrl : 'https://via.placeholder.com/80'
        }
      };
    });
    
    return {
      id: order.id,
      status: order.status,
      items: orderItems,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      rentStart: order.rentStart,
      rentEnd: order.rentEnd,
      customerInfo: (order as any).customerInfo
    };
  });
};

/**
 * Получает детали заказа по ID
 * @param orderId ID заказа
 * @returns Promise с данными заказа
 */
export const mockGetOrderDetail = async (orderId: number): Promise<any> => {
  await delay(1000); // Имитация задержки сервера
  
  // Находим заказ по ID
  const order = ORDERS_MOCK.find(o => o.id === orderId);
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  // Преобразуем в формат для UI
  const orderItems = order.items.map(item => {
    // Находим товар в моковых данных или создаем заглушку
    const product = PRODUCTS_MOCK.find((p) => p.id === item.productId) || {
      id: item.productId,
      name: `Товар #${item.productId}`,
      imageUrl: 'https://via.placeholder.com/80',
      price: item.price
    };
    
    return {
      id: Math.random(), // В реальном API было бы настоящее id
      productId: item.productId,
      days: item.days,
      pricePerDay: item.price,
      product: {
        name: product.name,
        image: 'imageUrl' in product ? product.imageUrl : 'https://via.placeholder.com/80'
      }
    };
  });
  
  return {
    id: order.id,
    status: order.status,
    items: orderItems,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    rentStart: order.rentStart,
    rentEnd: order.rentEnd,
    customerInfo: (order as any).customerInfo
  };
};

//Получает статистику для панели управления
export const mockGetDashboardStats = async () => {
  await delay(1000);
  return DASHBOARD_STATS_MOCK;
};

//Получает отчет о доходах за период
export const mockGetRevenueReport = async (dateRange: {
  startDate: string;
  endDate: string;
}) => {
  await delay(1000);
  return REVENUE_REPORT_MOCK;
}; 