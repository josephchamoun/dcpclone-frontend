'use client';
import React, { useEffect, useState } from 'react';
import { getUserReferrals } from '@/services/referralsService';
import styles from '@/styles/referrals.module.css';
import ReferralCard from '@/components/ReferralCard';
import { User, Users } from 'lucide-react';

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [noReferrals, setNoReferrals] = useState(false);
  const [userId, setUserId] = useState(undefined); // undefined by default
 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user'));
      setUserId(user?.id || null);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    async function fetchReferrals() {
      setLoading(true);
      setError('');
      setNoReferrals(false);
      try {
        const response = await getUserReferrals(userId);
        const rawReferrals = Array.isArray(response.data)
          ? response.data
          : response.data.referrals || [];

        if (rawReferrals.length === 0) {
          setNoReferrals(true);
        } else {
          const formattedReferrals = rawReferrals.map(referral => ({
            ...referral,
            is_admin: referral.is_admin ? 'Yes' : 'No',
          }));
          setReferrals(formattedReferrals);
        }
      } catch (err) {
        setError('Something went wrong while fetching referrals.');
      }
      setLoading(false);
    }
    fetchReferrals();
  }, [userId]);

  // Don't render anything until userId is set (prevents hydration mismatch)
  if (userId === undefined) {
    return null;
  }

return (
  <div className={styles.container}>
    <h1>Referrals</h1>

    {!loading && !error && !noReferrals && (
      <div className={styles.referralCount}>
        <Users size={22} />
        <span>Total: {referrals.length}</span>
      </div>
    )}

    {loading && <p>Loading...</p>}
    {error && <p className={styles.error}>{error}</p>}
    {noReferrals && !loading && !error && (
      <p className={styles.noReferrals}>No referrals found.</p>
    )}

    {!noReferrals && !loading && !error && (
      <div className={styles.cardGrid}>
        {referrals.map(referral => (
          <ReferralCard key={referral.id} referral={referral} />
        ))}
      </div>
    )}
  </div>
);

}