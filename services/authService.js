

import api from '@/lib/api';

export async function loginUser(data) {
  return api.post('/login', data); // no csrf cookie fetch needed
}


export async function registerUser(data) {
  
  return api.post('/register', data);
}


export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}