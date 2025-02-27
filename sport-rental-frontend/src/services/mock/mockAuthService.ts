import { USER_MOCK, ADMIN_MOCK } from '../../mocks/apiMocks';

export const mockLogin = async (email: string, password: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (email === 'admin@example.com' && password === 'admin') {
    localStorage.setItem('token', ADMIN_MOCK.token);
    return ADMIN_MOCK;
  }
  
  if (email === 'test@example.com' && password === 'password') {
    localStorage.setItem('token', USER_MOCK.token);
    return USER_MOCK;
  }

  throw new Error('Неверный email или пароль');
};

export const mockRegister = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newUser = {
    ...USER_MOCK,
    ...userData,
    id: Math.floor(Math.random() * 1000),
    token: 'new-user-token'
  };

  localStorage.setItem('token', newUser.token);
  return newUser;
};

export const mockLogout = () => {
  localStorage.removeItem('token');
}; 