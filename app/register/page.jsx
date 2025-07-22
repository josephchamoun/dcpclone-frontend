'use client';

import { useState } from 'react';
import { registerUser } from '@/services/authService';
import styles from '@/styles/registration.module.css';
import Link from 'next/link';

export default function RegistrationPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await registerUser({ name, email, password });
      console.log('Registration success:', response.data);
      setSuccess('Registered successfully!');
      window.location.href = '/login';
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      setError(message);
      console.error('Registration error:', message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>

        {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
        {success && <p className={`${styles.message} ${styles.success}`}>{success}</p>}

        <div className={styles.link}>
          Already have an account? <Link href="/login">Log in here</Link>
        </div>
      </div>
    </div>
  );
}
