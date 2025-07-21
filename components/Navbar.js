'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{
      padding: '1rem',
      backgroundColor: '#222',
      color: '#fff',
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      <div>
        <Link href="/home" style={{ marginRight: '1rem', color: '#fff' }}>Home</Link>
        <Link href="/profile" style={{ marginRight: '1rem', color: '#fff' }}>Profile</Link>
        <Link href="/users" style={{ marginRight: '1rem', color: '#fff' }}>Users</Link>
        <Link href="/about" style={{ marginRight: '1rem', color: '#fff' }}>About</Link>
        <Link href="/contact" style={{ color: '#fff' }}>Contact</Link>

      </div>
      <div>
  <button
    onClick={() => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }}
    style={{
      marginRight: '1rem',
      color: '#fff',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'underline',
      font: 'inherit',
      padding: 0
    }}
  >
    Logout
  </button>
      </div>
    </nav>
  );
}
