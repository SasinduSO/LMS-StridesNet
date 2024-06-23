import axios from 'axios';

export const setAuthUser = (token, user) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);  // Save the token in localStorage
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Use token, not user.token
};

export const getAuthUser = () => {
  const user = localStorage.getItem('user');
  //console.log(user);
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

