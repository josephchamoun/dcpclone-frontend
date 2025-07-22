'use client'; // Needed to use router in a client component

import { useRouter } from 'next/navigation';
import React from 'react';
import styles from '@/styles/welcome.module.css';

export default function HomePage() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/login');
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <main className={styles['homepage-container']}>
      <h1 className={styles['homepage-title']}>Welcome to My App</h1>
      <p className={styles['homepage-subtitle']}>
        Please log in or register to continue.
      </p>

      <div className={styles['homepage-buttons']}>
        <button
          onClick={goToLogin}
          className={`${styles['homepage-btn']} ${styles['login-btn']}`}
        >
          Go to Login
        </button>
        <button
          onClick={goToRegister}
          className={`${styles['homepage-btn']} ${styles['register-btn']}`}
        >
          Go to Register
        </button>
      </div>
    </main>
  );
}