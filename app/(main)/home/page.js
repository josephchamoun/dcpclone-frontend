'use client';
import React, { useState, useEffect } from 'react';
import { Lock, Star, Crown, Gem, Zap, Trophy, Unlock } from 'lucide-react';
import styles from '@/styles/home.module.css';

export default function ProfilePage() {
  const [userLevel, setUserLevel] = useState(0);
  const [canClick, setCanClick] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  const COOLDOWN_TIME = 5;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.level !== undefined) {
          setUserLevel(parsedUser.level);
        }
      } catch (err) {
        console.error('Error parsing user from localStorage:', err);
      }
    }
  }, []);

  const levels = [
    { id: 1, name: 'Novice', icon: Star, color: 'from-gray-400 to-gray-600', shadowColor: 'shadow-gray-500/50', description: 'Just getting started!', price:2},
    { id: 2, name: 'Explorer', icon: Zap, color: 'from-blue-400 to-blue-600', shadowColor: 'shadow-blue-500/50', description: 'Finding your way around', price:5 },
    { id: 3, name: 'Warrior', icon: Trophy, color: 'from-green-400 to-green-600', shadowColor: 'shadow-green-500/50', description: 'Building strength and skill',price:10 },
    { id: 4, name: 'Champion', icon: Crown, color: 'from-purple-400 to-purple-600', shadowColor: 'shadow-purple-500/50', description: 'A true force to be reckoned with', price:20 },
    { id: 5, name: 'Legend', icon: Gem, color: 'from-yellow-400 to-yellow-600', shadowColor: 'shadow-yellow-500/50', description: 'The stuff of legends', price:50 }
  ];

  const handleButtonClick = () => {
    if (!canClick) return;

    setCanClick(false);
    setTimeLeft(COOLDOWN_TIME);
    console.log('Button clicked! Performing action...');

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanClick(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleUnlockLevel = (id) => {
    if (id === userLevel + 1) {
      const newLevel = id;
      setUserLevel(newLevel);
      localStorage.setItem('user', JSON.stringify({ level: newLevel }));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Your Progress</h1>
          <p className={styles.subtitle}>Current Level: {userLevel}</p>
        </div>

        {/* Action Button */}
        <div className={styles.actionSection}>
          <button
            onClick={handleButtonClick}
            disabled={!canClick}
            className={`${styles.actionButton} ${canClick ? styles.enabled : styles.disabled}`}
          >
            {canClick ? (
              <>
                <Zap className={styles.buttonIcon} />
                Take Action
              </>
            ) : (
              <>
                <div className={`${styles.buttonIcon} ${styles.spinner}`}></div>
                Wait {formatTime(timeLeft)}
              </>
            )}
          </button>
        </div>

        {/* Levels Grid */}
        <div className={styles.levelsGrid}>
          {levels.map((level) => {
            const isUnlocked = userLevel >= level.id;
            const canUnlock = userLevel + 1 === level.id;
            const IconComponent = level.icon;

            return (
              <div key={level.id} className={`${styles.levelCard} ${isUnlocked ? styles.unlocked : styles.locked}`}>
                <div
                  className={`${styles.levelContent} bg-gradient-to-br ${
                    isUnlocked ? level.color : 'from-gray-300 to-gray-500'
                  } ${isUnlocked ? 'ring-2 ring-white/50' : ''}`}
                >
                  <div className={styles.levelHeader}>
                    <div className={styles.levelNumber}>{level.id}</div>
                    {!isUnlocked && <Lock className={styles.lockIcon} />}
                  </div>
                 <div className={styles.levelPrice}>${level.price}/day</div>


                  <div className={styles.levelIconContainer}>
                    <IconComponent
                      className={`${styles.levelIcon} ${isUnlocked ? 'text-white' : 'text-gray-400'}`}
                    />
                  </div>
                  


                  <div className={styles.levelInfo}>
                    <h3 className={`${styles.levelName} ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                      {level.name}
                    </h3>
                    <p className={`${styles.levelDescription} ${isUnlocked ? 'text-white/80' : 'text-gray-400'}`}>
                      {isUnlocked ? level.description : 'Locked'}
                    </p>
                  </div>

                  {/* Unlock Button for Locked Levels */}
                  {!isUnlocked && canUnlock && (
                    <button
                      onClick={() => handleUnlockLevel(level.id)}
                      className={styles.unlockButton}
                    >
                      <Unlock size={16} />
                      Unlock Level
                    </button>

                  )}

                  {isUnlocked && (
                    <div className={`${styles.levelGlow} ${level.shadowColor}`}></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Debug Controls (remove in production) */}
        <div className={styles.debugSection}>
          <p className={styles.debugTitle}>Debug Controls:</p>
          <div className={styles.debugButtons}>
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setUserLevel(level)}
                className={`${styles.debugBtn} ${userLevel === level ? styles.active : ''}`}
              >
                Level {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
