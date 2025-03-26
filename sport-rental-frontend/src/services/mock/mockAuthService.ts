import { USER_MOCK, ADMIN_MOCK } from '../../mocks/apiMocks';

/*
 * Имитирует процесс аутентификации пользователя
 * Проверяет учетные данные и возвращает информацию о пользователе
 */
export const mockLogin = async (email: string, password: string) => {
  // Имитируем задержку сервера в 1 секунду
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Проверяем учетные данные администратора
  if (email === 'admin@example.com' && password === 'admin') {
    // Сохраняем токен в localStorage для имитации сессии
    localStorage.setItem('token', ADMIN_MOCK.token);
    return ADMIN_MOCK; // Возвращаем данные администратора
  }
  
  // Проверяем учетные данные обычного пользователя
  if (email === 'test@example.com' && password === 'password') {
    // Сохраняем токен в localStorage для имитации сессии
    localStorage.setItem('token', USER_MOCK.token);
    return USER_MOCK; // Возвращаем данные пользователя
  }

  // Если учетные данные не совпадают, выбрасываем ошибку
  throw new Error('Неверный email или пароль');
};

/*
 * Имитирует процесс регистрации нового пользователя
 * Создает нового пользователя с указанными данными
 */
export const mockRegister = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}) => {
  // Имитируем задержку сервера
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Создаем нового пользователя, комбинируя моковые данные с переданными
  const newUser = {
    ...USER_MOCK,           // Базовые данные из мока
    ...userData,            // Переданные пользовательские данные
    id: Math.floor(Math.random() * 1000), // Генерируем случайный ID
    token: 'new-user-token' // Назначаем токен
  };

  // Сохраняем токен в localStorage для автоматической аутентификации
  localStorage.setItem('token', newUser.token);
  return newUser;
};

/*
 * Имитирует процесс выхода пользователя из системы
 * Удаляет токен аутентификации из localStorage
*/
export const mockLogout = () => {
  // Удаляем токен из localStorage, что приводит к "выходу" пользователя
  localStorage.removeItem('token');
}; 