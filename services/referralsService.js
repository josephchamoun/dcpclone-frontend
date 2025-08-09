import api from '@/lib/api';

export async function getUserReferrals(userId) {
  const token = localStorage.getItem('token');
  return api.get(`/user/${userId}/referrals`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}



