import api from '@/lib/api';

export async function getallusers(){
  const token = localStorage.getItem('token');
  return api.get('/users', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}


export async function userinfo() {
  const token = localStorage.getItem('token');
  return api.get('/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}
