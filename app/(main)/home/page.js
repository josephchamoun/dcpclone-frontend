'use client';
import React, { useState, useEffect } from 'react';
import {
  Lock,
  Star,
  Crown,
  Gem,
  Zap,
  Trophy,
  Unlock,
  PlusCircle,
} from 'lucide-react';
import styles from '@/styles/home.module.css';
import { getlevels } from '@/services/levelService';

export default function ProfilePage() {
  const [userLevel, setUserLevel] = useState(0);
  const [canClick, setCanClick] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [levels, setLevels] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);

  const COOLDOWN_TIME = 5;

  const icons = [Star, Zap, Trophy, Crown, Gem]; // repeatable icon set

useEffect(() => {
  const fetchLevels = async () => {
    try {
      const levelsData = await getlevels();
      if (Array.isArray(levelsData)) {
        setLevels(levelsData);
      } else {
        console.error('Expected array of levels, got:', levelsData);
        setLevels([]);
      }
    } catch (error) {
      console.error('Failed to fetch levels:', error);
      setLevels([]);
    }
  };

  fetchLevels();
}, []);


  const handleButtonClick = () => {
    if (!canClick) return;

    setCanClick(false);
    setTimeLeft(COOLDOWN_TIME);

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

  const handleUnlockLevel = (levelNumber) => {
    if (levelNumber === userLevel + 1) {
      setUserLevel(levelNumber);
      localStorage.setItem('user', JSON.stringify({ level: levelNumber }));
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
            className={`${styles.actionButton} ${
              canClick ? styles.enabled : styles.disabled
            }`}
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

        {/* Add Level Button */}
        <div className={styles.addLevelWrapper}>
          <button
            className={styles.addLevelButton}
            onClick={() => setShowAddCard((prev) => !prev)}
          >
            <PlusCircle size={18} />
            Add New Level
          </button>
        </div>

        {/* Add Level Form Card */}
        {showAddCard && (
          <div className={styles.addLevelCard}>
            <h3>Add a New Level</h3>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input type="text" placeholder="Level name" />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <input type="text" placeholder="Short description" />
            </div>
            <div className={styles.formGroup}>
              <label>Level Number</label>
              <input type="number" placeholder="e.g. 6" />
            </div>
            <div className={styles.formGroup}>
              <label>Unlock Price</label>
              <input type="number" placeholder="e.g. 100" />
            </div>
            <div className={styles.formGroup}>
              <label>Money per Day</label>
              <input type="number" placeholder="e.g. 15" />
            </div>
            <button className={styles.saveButton}>Save Level</button>
          </div>
        )}

        {/* Levels Grid */}
        <div className={styles.levelsGrid}>
          {Array.isArray(levels) &&
            levels.map((level, index) => {
              const isUnlocked = userLevel >= level.level_number;
              const canUnlock = userLevel + 1 === level.level_number;
              const IconComponent = icons[index % icons.length];

              return (
                <div
                  key={level.level_number}
                  className={`${styles.levelCard} ${
                    isUnlocked ? styles.unlocked : styles.locked
                  }`}
                >
                  <div
                    className={`${styles.levelContent} bg-gradient-to-br ${
                      isUnlocked
                        ? 'from-indigo-400 to-indigo-600'
                        : 'from-gray-300 to-gray-500'
                    } ${isUnlocked ? 'ring-2 ring-white/50' : ''}`}
                  >
                    <div className={styles.levelHeader}>
                      <div className={styles.levelNumber}>
                        {level.level_number}
                      </div>
                      {!isUnlocked && <Lock className={styles.lockIcon} />}
                    </div>

                    <div className={styles.levelPrice}>
                      ${level.money_per_day}/day
                    </div>

                    <div className={styles.levelIconContainer}>
                      <IconComponent
                        className={`${styles.levelIcon} ${
                          isUnlocked ? 'text-white' : 'text-gray-400'
                        }`}
                      />
                    </div>

                    <div className={styles.levelInfo}>
                      <h3
                        className={`${styles.levelName} ${
                          isUnlocked ? 'text-white' : 'text-gray-500'
                        }`}
                      >
                        {level.name}
                      </h3>
                      <p
                        className={`${styles.levelDescription} ${
                          isUnlocked ? 'text-white/80' : 'text-gray-400'
                        }`}
                      >
                        {isUnlocked ? level.description : 'Locked'}
                      </p>
                    </div>

                    {!isUnlocked && canUnlock && (
                      <button
                        onClick={() =>
                          handleUnlockLevel(level.level_number)
                        }
                        className={styles.unlockButton}
                      >
                        <Unlock size={16} />
                        Unlock Level
                      </button>
                    )}

                    {isUnlocked && (
                      <div className={`${styles.levelGlow} shadow-indigo-500/50`}></div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Debug Controls */}
        <div className={styles.debugSection}>
          <p className={styles.debugTitle}>Debug Controls:</p>
          <div className={styles.debugButtons}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((level) => (
              <button
                key={level}
                onClick={() => setUserLevel(level)}
                className={`${styles.debugBtn} ${
                  userLevel === level ? styles.active : ''
                }`}
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
