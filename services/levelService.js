import api from '@/lib/api';

export async function getlevels() {
  const token = localStorage.getItem('token');

  const response = await api.get('/levels', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  return response.data; // ✅ return only the actual level array
}


export async function getLevelById(id) {
  const token = localStorage.getItem('token');
  return api.get(`/levels/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}
