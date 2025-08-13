import api from '@/lib/api';

export async function addMoneyToBalance() {
  const token = localStorage.getItem('token');
  return api.put(
    '/addmoney', 
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
