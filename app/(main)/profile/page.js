'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { generateWallet, getWalletBalance, addMoneyToBalance, getAppBalance } from '@/services/walletService';
import styles from '@/styles/profile.module.css';
import { getLevelById } from '@/services/levelService';

export default function ProfilePage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState(0);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(null);
  const [appBalance, setAppBalance] = useState(null);
  const [referral_code, setReferralCode]= useState('');
  const [error, setError] = useState('');

  // Fetch balance for given address
  const fetchBalance = useCallback(async (addr) => {
    try {
      const response = await getWalletBalance(addr);
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  }, []);

  // Fetch app balance
  const fetchAppBalance = useCallback(async () => {
    try {
      const response = await getAppBalance();
      setAppBalance(response.data.balance);
    } catch (error) {
      console.error('Failed to fetch app balance:', error);
    }
  }, []);

  // Generate address for user if not present
  const generateAddressForUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await generateWallet();
      const newAddress = response.data.address;
      setAddress(newAddress);

      // Update localStorage with new address
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.deposit_address = newAddress;
        localStorage.setItem('user', JSON.stringify(user));
      }

      await fetchBalance(newAddress);
    } catch (error) {
      alert('Failed to generate wallet address');
      console.error(error);
    }
    setLoading(false);
  }, [fetchBalance]);

  // Load user info on first render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setEmail(user.email || '');
      setName(user.name || '');
      setReferralCode(user.referral_code || '');

      // Fetch level info using level_id
      if (user.level_id) {
        getLevelById(user.level_id).then(response => {
          setLevel(response.data.level_number);
        });
      } else {
        setLevel(0);
      }

      if (user.deposit_address) {
        setAddress(user.deposit_address);
        fetchBalance(user.deposit_address);
        fetchAppBalance();
      } else {
        generateAddressForUser();
      }
    }
  }, [fetchBalance, fetchAppBalance, generateAddressForUser]);

  const handleClaimMoney = async () => {
    setError('');
    try {
      await addMoneyToBalance();
      await fetchAppBalance(); // Refresh app balance after claiming
    } catch (err) {
      setError('Failed to claim money: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  return (
    <div className={styles['profile-container']}>
      <div className={styles['profile-info']}>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Level:</strong> {level}</p>
        <p><strong>Your Referral Code:</strong> {referral_code}</p>
      </div>

      <div className={styles.section}>
        <h3>Your Deposit Address</h3>
        {address ? (
          <span className={styles.address}>{address}</span>
        ) : (
          <p className={styles.loading}>Generating address...</p>
        )}
      </div>

      <div className={styles.section}>
        <h3>App Balance</h3>
        {appBalance !== null ? (
          <span className={styles['app-balance']}>{appBalance} ETH</span>
        ) : (
          <p className={styles.loading}>Loading app balance...</p>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}