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
  Flame,
} from 'lucide-react';
import styles from '@/styles/home.module.css';
import { getlevels, getLevelById, addLevel, deleteLevel } from '@/services/levelService';
import { userinfo, updateUserLevel } from '@/services/userService';
import { addMoneyToBalance } from '@/services/balanceService';

export default function HomePage() {
  const [userLevel, setUserLevel] = useState(0);
  const [dailyReward, setDailyReward] = useState(0);
  const [canClick, setCanClick] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [levels, setLevels] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [unlockError, setUnlockError] = useState({});
  const [newLevel, setNewLevel] = useState({
    name: '',
    description: '',
    level_number: '',
    unlock_price: '',
    money_per_day: '',
  });

  const COOLDOWN_TIME = 5;
  const icons = [Star, Zap, Flame, Trophy, Crown, Gem];

  // Fetch levels from API
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


const fetchUserData = async () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user.level_id) {
      const res = await getLevelById(user.level_id);
      if (res?.data) {
        setUserLevel(res.data.level_number);
        setDailyReward(parseFloat(res.data.daily_reward)); 
      }
    }
  }
  try {
    const res = await userinfo();
    setIsAdmin(res.data.isAdmin);
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
};


  useEffect(() => {
    fetchUserData();
    fetchLevels();

    // Listen to localStorage changes (level updates from other components/tabs)
    const handleStorageChange = () => {
      fetchUserData();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleButtonClick = () => {
    if (!canClick) return;
    console.log(`Collected $${dailyReward}`);
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

    addMoneyToBalance()
      .then(() => {
        console.log('Money added to balance');
      })
      .catch((error) => {
        console.error('Failed to add money to balance:', error);
      });
  };

  const handleUnlockLevel = (levelNumber) => {
    setUnlockError((prev) => ({ ...prev, [levelNumber]: '' }));
    updateUserLevel(levelNumber)
      .then(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...user, level_id: levelNumber };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        fetchUserData(); // instantly refresh level + reward
      })
      .catch((error) => {
        const msg =
          error.response?.data?.message ||
          'Failed to unlock level. Please try again.';
        setUnlockError((prev) => ({ ...prev, [levelNumber]: msg }));
      });
  };

  const handleSaveLevel = async () => {
    try {
      await addLevel(newLevel);
      alert('Level added!');
      setShowAddCard(false);
      setNewLevel({
        name: '',
        description: '',
        level_number: '',
        unlock_price: '',
        money_per_day: '',
      });
      await fetchLevels();
    } catch (error) {
      alert('Failed to add level: ' + (error.response?.data?.message || 'Unexpected error'));
      console.error(error);
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
                Collect ${dailyReward}
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
        {isAdmin && (
          <div className={styles.addLevelWrapper}>
            <button
              className={styles.addLevelButton}
              onClick={() => setShowAddCard((prev) => !prev)}
            >
              <PlusCircle size={18} />
              Add New Level
            </button>
          </div>
        )}

        {/* Add Level Form */}
        {showAddCard && (
          <div className={styles.addLevelCard}>
            <h3>Add a New Level</h3>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input
                type="text"
                placeholder="Level name"
                value={newLevel.name}
                onChange={(e) => setNewLevel({ ...newLevel, name: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <input
                type="text"
                placeholder="Short description"
                value={newLevel.description}
                onChange={(e) => setNewLevel({ ...newLevel, description: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Level Number</label>
              <input
                type="number"
                placeholder="e.g. 6"
                value={newLevel.level_number}
                onChange={(e) => setNewLevel({ ...newLevel, level_number: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Unlock Price</label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={newLevel.unlock_price}
                onChange={(e) => setNewLevel({ ...newLevel, unlock_price: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Money per Day</label>
              <input
                type="number"
                placeholder="e.g. 15"
                value={newLevel.money_per_day}
                onChange={(e) => setNewLevel({ ...newLevel, money_per_day: e.target.value })}
              />
            </div>
            <button className={styles.saveButton} onClick={handleSaveLevel}>
              Save Level
            </button>
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
                    {/* Level Header */}
                    <div className={styles.levelHeader}>
                      <div className={styles.levelNumber}>{level.level_number}</div>
                      {!isUnlocked && <Lock className={styles.lockIcon} />}
                    </div>

                    {/* Daily Reward */}
                    <div className={styles.levelPrice}>
                      ${level.money_per_day}/day
                    </div>

                    {/* Icon */}
                    <div className={styles.levelIconContainer}>
                      <IconComponent
                        className={`${styles.levelIcon} ${
                          isUnlocked ? 'text-white' : 'text-gray-400'
                        }`}
                      />
                    </div>

                    {/* Info */}
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

                    {/* Unlock Button */}
                    {!isUnlocked && canUnlock && (
                      <>
                        <button
                          onClick={() => handleUnlockLevel(level.level_number)}
                          className={styles.unlockButton}
                        >
                          <Unlock size={16} />
                          Unlock Level ({level.unlock_price}$)
                        </button>
                        {unlockError[level.level_number] && (
                          <div style={{ color: 'red', marginTop: '0.5rem', textAlign: 'center' }}>
                            {unlockError[level.level_number]}
                          </div>
                        )}
                      </>
                    )}

                    {/* Glow Effect */}
                    {isUnlocked && (
                      <div className={`${styles.levelGlow} shadow-indigo-500/50`} />
                    )}

                    {/* Admin Controls */}
                    {isAdmin && (
                      <div className={styles.adminControls}>
                        <button
                          className={styles.deleteButton}
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete level ${level.level_number}?`
                              )
                            ) {
                              deleteLevel(level.level_number)
                                .then(() => {
                                  fetchLevels();
                                })
                                .catch((error) => {
                                  console.error('Failed to delete level:', error);
                                  alert('Failed to delete level');
                                });
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
