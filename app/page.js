'use client'; // Needed to use router in a client component

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/login');
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to My App</h1>
      <p>Please log in or register to continue.</p>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={goToLogin} style={{ marginRight: '1rem' }}>
          Go to Login
        </button>
        <button onClick={goToRegister}>
          Go to Register
        </button>
      </div>
    </main>
  );
}
