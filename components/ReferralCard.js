'use client';
import React from 'react';
import styles from '@/styles/card.module.css';
import { Mail, Star, Shield, Banknote, DollarSign } from 'lucide-react';

export default function ReferralCard({ referral }) {
  const adminClass =
    referral.is_admin === 'Yes' ? styles.adminYes : styles.adminNo;

  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{referral.name}</h3>

      <p className={styles.email}>
        <Mail size={16} /> {referral.email}
      </p>

      <p className={styles.level}>
        <Star size={16} /> Level: {referral.level_number ?? 'N/A'}
      </p>


       <p className={styles.email}>
        <DollarSign size={20} /> Money Earned: {referral.referral_amount}
      </p>

    </div>
  );
}
