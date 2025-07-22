'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginUser } from '@/services/authService';
import styles from '@/styles/login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await loginUser({ email, password });
      setSuccess('Logged in successfully!');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.location.href = '/profile';
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed.';
      setError(message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Welcome Back</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Login</button>
        </form>

        {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
        {success && <p className={`${styles.message} ${styles.success}`}>{success}</p>}

        <div className={styles.registerLink}>
          Don’t have an account?{' '}
          <Link href="/register">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}