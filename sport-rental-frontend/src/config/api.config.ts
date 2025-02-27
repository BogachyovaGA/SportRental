// Определяем базовый URL для API запросов
// Если в переменных окружения есть REACT_APP_API_URL, используем его
// Иначе используем локальный адрес http://localhost:8080/api
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Функция для получения заголовков авторизации
export const getAuthHeader = () => {
  // Получаем JWT токен из локального хранилища браузера
  // localStorage - это место, где браузер может хранить данные даже после перезагрузки страницы
  const token = localStorage.getItem('token');

  // Возвращаем объект с заголовками
  return {
    // Добавляем токен в формате "Bearer {token}"
    // Bearer - это стандартный префикс для JWT токенов
    'Authorization': `Bearer ${token}`,

    // Указываем, что мы будем отправлять и получать данные в формате JSON
    'Content-Type': 'application/json'
  };
}; 