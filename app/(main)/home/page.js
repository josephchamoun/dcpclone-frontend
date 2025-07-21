'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { generateWallet, getWalletBalance, addMoneyToBalance, getAppBalance } from '@/services/walletService';
import axios from 'axios';
export default function ProfilePage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(null);
  const [appBalance, setAppBalance] = useState(null);
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
    <div style={{ padding: '1rem' }}>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>

      <div style={{ marginTop: '1rem' }}>
        <h3>Your Deposit Address</h3>
        {address ? (
          <code>{address}</code>
        ) : (
          <p>Generating address...</p>
        )}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3>Balance</h3>
        {balance !== null ? (
          <p>{balance} ETH</p>
        ) : (
          <p>Loading balance...</p>
        )}
      </div>
        <div style={{ marginTop: '1.5rem' }}>
            <h3>App Balance</h3>
            {appBalance !== null ? (
            <p>{appBalance} ETH</p>
            ) : (
            <p>Loading app balance...</p>
            )}
        </div>
      <button
        onClick={handleClaimMoney}
        
        style={{ marginTop: '1rem' }}
      >
        Claim Money
      </button>
    </div>
  );
}
