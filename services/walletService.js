import api from '@/lib/api';

export async function generateWallet(data) {
  const token = localStorage.getItem('token');
  return api.post('/wallet/generate', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export async function getWalletBalance(address) {
  const token = localStorage.getItem('token');
  return api.get('/wallet/balance', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: { address },
  });
}