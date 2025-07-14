'use client';
import React from 'react';


import { useState } from 'react';
import { useEffect } from 'react';


export default function ProfilePage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');


  useEffect(() => {
    // Get user info from localStorage
    const storedEmail = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '';
    const storedName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : '';
    if (storedEmail) setEmail(storedEmail);
    if (storedName) setName(storedName);
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
    </div>
  );
}
