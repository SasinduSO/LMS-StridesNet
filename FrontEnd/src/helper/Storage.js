import axios from 'axios';

export const setAuthUser = (token, user) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);  // Save the token in localStorage
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Use token, not user.token
};

export const getAuthUser = () => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  if (user && token) {
    return { ...JSON.parse(user), token };
  }
  return null;
};

export const removeAuthUser = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

/*
import axios from 'axios';

export const setAuthUser = (token, data) => {
  localStorage.setItem('user', JSON.stringify(data));
  localStorage.setItem('token', token);  // Save the token in localStorage
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getAuthUser = () => {
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  if (userData && token) {
    return {
      user: JSON.parse(userData),
      token: token
    };
  }
  
  return null;
};

export const removeAuthUser = () => {
  if (localStorage.getItem('user')) localStorage.removeItem('user');
  if (localStorage.getItem('token')) localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
};
*/