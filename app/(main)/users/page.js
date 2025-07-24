'use client';
import React, { useEffect, useState } from 'react';
import { getallusers } from '@/services/userService';
import DataTable from '@/components/DataTable';
import styles from '@/styles/users.module.css';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

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

  useEffect(() => {
    if (!search) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(
          user =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, users]);

  const handleStopAccount = (user) => {
    // TODO: Implement stop account logic (API call)
    alert(`Stop account for user: ${user.name} (ID: ${user.id})`);
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'created_at', header: 'Created At' },
    { key: 'updated_at', header: 'Updated At' },
    { key: 'deposit_address', header: 'Deposit Address' },
    { key: 'balance', header: 'Balance' },
    { key: 'level', header: 'Level' },
    { key: 'is_admin', header: 'Is Admin' },
  ];

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
      <DataTable columns={columns} data={filteredUsers} loading={loading} error={error} onStopAccount={handleStopAccount} />
    </div>
  );
}