'use client';
import React, { useEffect, useState } from 'react';


import styles from '@/styles/referrals.module.css';

export default function ReferralsPage() {


  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError('');
      try {
        const response = await getallusers();
        const rawUsers = Array.isArray(response.data) ? response.data : response.data.users || [];
        const formattedUsers = rawUsers.map(user => ({
          ...user,
          is_admin: user.is_admin ? 'Yes' : 'No',
        }));
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } catch (err) {
        setError('Failed to load users');
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  

  
  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2>All Users</h2>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>
     
    </div>
  );
}