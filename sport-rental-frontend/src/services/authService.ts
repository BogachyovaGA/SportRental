import { API_BASE_URL } from '../config/api.config';


//Функция для авторизации пользователя
export const login = async (email: string, password: string) => {
  try {
    // Отправляем POST запрос на сервер для авторизации
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST', // Указываем метод запроса
      headers: {
        'Content-Type': 'application/json', // Указываем тип отправляемых данных
      },
      // Преобразуем данные в JSON строку и отправляем в теле запроса
      body: JSON.stringify({ email, password }),
    });

    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Получаем данные ответа и преобразуем их из JSON
    const data = await response.json();
    // Сохраняем токен в локальное хранилище браузера для последующих запросов
    localStorage.setItem('token', data.token);
    // Возвращаем полученные данные
    return data;
  } catch (error) {
    // Если произошла ошибка, логируем её и пробрасываем дальше
    console.error('Ошибка при входе:', error);
    throw error;
  }
};


//Функция для регистрации нового пользователя
export const register = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}) => {
  try {
    // Отправляем POST запрос на сервер для регистрации
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Отправляем все данные пользователя в теле запроса
      body: JSON.stringify(userData),
    });

    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Получаем данные ответа
    const data = await response.json();
    // Сохраняем полученный токен в локальное хранилище
    localStorage.setItem('token', data.token);
    // Возвращаем данные нового пользователя
    return data;
  } catch (error) {
    // Обрабатываем ошибки при регистрации
    console.error('Ошибка при регистрации:', error);
    throw error;
  }
};

//Функция для выхода пользователя из системы
export const logout = () => {
  // Удаляем токен из localStorage, что приводит к выходу пользователя из системы
  localStorage.removeItem('token');
}; 

/*
login - авторизация пользователя:
Принимает email и пароль
Отправляет данные на сервер
При успешном входе сохраняет токен
Возвращает данные пользователя
register - регистрация нового пользователя:
Принимает объект с данными пользователя
Отправляет данные на сервер
При успешной регистрации сохраняет токен
Возвращает данные созданного пользователя
logout - выход из системы:
Удаляет токен авторизации
Это приводит к выходу пользователя из системы
*/