'use client';

import Link from 'next/link';
import { useState } from 'react';
import { userinfo } from '@/services/userService';
import { useEffect} from 'react';
import {usePathname} from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await userinfo();
        setIsAdmin(res.data.isAdmin);
      } catch (error) {
        setIsAdmin(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo/Brand */}
        <div className="nav-logo">
          <Link href="/home">
            <span className="logo-text">CryptoWallet</span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          <Link href="/home" className={`nav-link${pathname === '/home' ? ' active' : ''}`}>
            <span>Home</span>
          </Link>
          <Link href="/profile" className={`nav-link${pathname === '/profile' ? ' active' : ''}`}>
            <span>Profile</span>
          </Link>
          <Link href="/referrals" className={`nav-link${pathname === '/referrals' ? ' active' : ''}`}>
            <span>Referrals</span>
          </Link>
          {isAdmin && (
            <Link href="/users" className={`nav-link${pathname === '/users' ? ' active' : ''}`}>
              <span>Users</span>
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className={`nav-link${pathname === '/admin' ? ' active' : ''}`}>
              <span>Admin</span>
            </Link>
          )}
          <Link href="/about" className={`nav-link${pathname === '/about' ? ' active' : ''}`}>
            <span>About</span>
          </Link>
          <Link href="/contact" className={`nav-link${pathname === '/contact' ? ' active' : ''}`}>
            <span>Contact</span>
          </Link>
        </div>

        {/* Logout Button */}
        <div className="nav-auth">
          <button onClick={handleLogout} className="logout-btn">
            <span>Logout</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
  <Link
    href="/home"
    className={`mobile-link${pathname === '/home' ? ' active' : ''}`}
    onClick={() => setIsMenuOpen(false)}
  >
    Home
  </Link>
  <Link
      href="/profile"
      className={`mobile-link${pathname === '/profile' ? ' active' : ''}`}
      onClick={() => setIsMenuOpen(false)}
    >
      Profile
    </Link>
     <Link
      href="/referrals"
      className={`mobile-link${pathname === '/referrals' ? ' active' : ''}`}
      onClick={() => setIsMenuOpen(false)}
    >
      Referrals
    </Link>

  {isAdmin && (
    <Link
      href="/users"
      className={`mobile-link${pathname === '/users' ? ' active' : ''}`}
      onClick={() => setIsMenuOpen(false)}
    >
      Users
    </Link>
  )}
  {isAdmin && (
    <Link
      href="/admin"
      className={`mobile-link${pathname === '/admin' ? ' active' : ''}`}
      onClick={() => setIsMenuOpen(false)}
    >
      Admin
    </Link>
  )}
  <Link
    href="/about"
    className={`mobile-link${pathname === '/about' ? ' active' : ''}`}
    onClick={() => setIsMenuOpen(false)}
  >
    About
  </Link>
  <Link
    href="/contact"
    className={`mobile-link${pathname === '/contact' ? ' active' : ''}`}
    onClick={() => setIsMenuOpen(false)}
  >
    Contact
  </Link>
  <button onClick={handleLogout} className="mobile-logout">
    Logout
  </button>
</div>

      <style>{`

      .mobile-link.active {
  color: #fff;
  background: rgba(102, 126, 234, 0.25);
}
      .nav-link.active {
          color: #fff;
          background: rgba(102, 126, 234, 0.25);
        }
        .navbar {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .nav-logo {
          flex-shrink: 0;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-decoration: none;
          letter-spacing: -0.025em;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-grow: 1;
          justify-content: center;
        }

        .nav-link {
          position: relative;
          color: rgba(241, 245, 249, 0.8);
          text-decoration: none;
          padding: 0.75rem 1.25rem;
          font-weight: 500;
          font-size: 0.95rem;
          border-radius: 10px;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          letter-spacing: 0.025em;
        }

        .nav-link:hover {
          color: white;
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }

        .nav-link::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: all 0.3s ease;
          transform: translateX(-50%);
          border-radius: 1px;
        }

        .nav-link:hover::before {
          width: 80%;
        }

        .nav-auth {
          flex-shrink: 0;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          position: relative;
          overflow: hidden;
        }

        .logout-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .logout-btn:hover::before {
          left: 100%;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .logout-btn:active {
          transform: translateY(0);
        }

        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .mobile-menu-btn span {
          width: 25px;
          height: 3px;
          background: white;
          border-radius: 2px;
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .mobile-menu-btn.active span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }

        .mobile-menu-btn.active span:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-btn.active span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.98);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(148, 163, 184, 0.1);
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .mobile-menu.active {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .mobile-link, .mobile-logout {
          display: block;
          color: rgba(241, 245, 249, 0.9);
          text-decoration: none;
          padding: 1rem 2rem;
          font-weight: 500;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          transition: all 0.3s ease;
        }

        .mobile-logout {
          background: none;
          border: none;
          font: inherit;
          cursor: pointer;
          color: #ef4444;
          font-weight: 600;
          border-bottom: none;
        }

        .mobile-link:hover, .mobile-logout:hover {
          background: rgba(102, 126, 234, 0.1);
          color: white;
        }

        @media (max-width: 768px) {
          .nav-container {
            padding: 0 1rem;
          }

          .nav-links, .nav-auth {
            display: none;
          }

          .mobile-menu-btn {
            display: flex;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            height: 60px;
          }

          .logo-text {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </nav>
  );
}