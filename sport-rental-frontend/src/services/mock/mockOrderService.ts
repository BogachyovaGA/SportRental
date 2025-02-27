import { ORDERS_MOCK, DASHBOARD_STATS_MOCK, REVENUE_REPORT_MOCK } from '../../mocks/apiMocks';

// Имитация задержки сервера
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type OrderStatus = 'pending' | 'active' | 'completed' | 'cancelled';

interface OrderFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
}

// Моковые данные для заказов
let mockOrders = [
  {
    id: 1,
    userId: "1",
    userName: "Иван Петров",
    status: 'active' as OrderStatus,
    items: [
      {
        id: 1,
        productId: 1,
        days: 3,
        pricePerDay: 1000,
        product: {
          name: "Горные лыжи",
          image: "/images/skis.jpg"
        }
      }
    ],
    totalAmount: 3000,
    createdAt: "2024-03-15",
    rentStart: "2024-03-20",
    rentEnd: "2024-03-23"
  },
  {
    id: 2,
    userId: "2",
    userName: "Анна Сидорова",
    status: 'completed' as OrderStatus,
    items: [
      {
        id: 2,
        productId: 2,
        days: 5,
        pricePerDay: 1200,
        product: {
          name: "Сноуборд",
          image: "/images/snowboard.jpg"
        }
      }
    ],
    totalAmount: 6000,
    createdAt: "2024-03-10",
    rentStart: "2024-03-12",
    rentEnd: "2024-03-17"
  }
];

export const mockGetAllOrders = async (filters?: OrderFilters) => {
  await delay(1000);
  let filteredOrders = [...mockOrders];

  if (filters?.status) {
    filteredOrders = filteredOrders.filter(order => order.status === filters.status);
  }

  if (filters?.startDate) {
    filteredOrders = filteredOrders.filter(order => order.rentStart >= filters.startDate!);
  }

  if (filters?.endDate) {
    filteredOrders = filteredOrders.filter(order => order.rentEnd <= filters.endDate!);
  }

  return filteredOrders;
};

export const mockGetOrderById = async (orderId: number) => {
  await delay(1000);
  const order = mockOrders.find(order => order.id === orderId);
  if (!order) throw new Error('Заказ не найден');
  return order;
};

export const mockUpdateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
  await delay(1000);
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) throw new Error('Заказ не найден');
  
  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    status: newStatus
  };
  return mockOrders[orderIndex];
};

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

export const mockGetUserOrders = async () => {
  await delay(1000);
  return [...mockOrders];
};

export const mockCreateOrder = async (orderData: {
  rentStart: string;
  rentEnd: string;
  items: Array<{ productId: number; days: number; }>;
}) => {
  await delay(1000);
  const newOrder = {
    id: mockOrders.length + 1,
    userId: "3",
    userName: "Новый Пользователь",
    status: 'pending' as OrderStatus,
    items: orderData.items.map((item, index) => ({
      id: index + 1,
      productId: item.productId,
      days: item.days,
      pricePerDay: 1000,
      product: {
        name: "Тестовый продукт",
        image: "/images/test.jpg"
      }
    })),
    totalAmount: orderData.items.reduce((sum, item) => sum + (1000 * item.days), 0),
    createdAt: new Date().toISOString(),
    rentStart: orderData.rentStart,
    rentEnd: orderData.rentEnd
  };

  mockOrders.push(newOrder);
  return newOrder;
};

export const mockGetDashboardStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return DASHBOARD_STATS_MOCK;
};

export const mockGetRevenueReport = async (dateRange: {
  startDate: string;
  endDate: string;
}) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return REVENUE_REPORT_MOCK;
}; 