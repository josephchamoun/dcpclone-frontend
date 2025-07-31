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



export async function addLevel(levelData) {
  const token = localStorage.getItem('token');
  return api.post('/add_level', levelData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}


export async function deleteLevel(levelNumber) {
  const token = localStorage.getItem('token');
  return api.delete(`/delete_level/${levelNumber}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}