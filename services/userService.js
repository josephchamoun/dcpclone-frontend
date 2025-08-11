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


export async function updateUserLevel(levelNumber) {
  const token = localStorage.getItem('token');
  return api.put(
    `/update/level/${levelNumber}`,
    {}, // empty body
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );
}


