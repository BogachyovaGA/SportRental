export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}; 