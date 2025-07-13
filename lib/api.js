
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Change to your Laravel backend URL
  withCredentials: true, // Needed if using cookies (e.g. Laravel Sanctum)
});
export const csrf = () => api.get('/sanctum/csrf-cookie');
export default api;
