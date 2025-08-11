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
import { getlevels } from '@/services/levelService';
import { userinfo } from '@/services/userService';
import { getLevelById } from '@/services/levelService';
import { addLevel } from '@/services/levelService';
import { deleteLevel } from '@/services/levelService';
import { updateUserLevel } from '@/services/userService';

export default function HomePage() {
  const [userLevel, setUserLevel] = useState(0);
  const [canClick, setCanClick] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [levels, setLevels] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  const [newLevel, setNewLevel] = useState({
  name: '',
  description: '',
  level_number: '',
  unlock_price: '',
  money_per_day: '',
});


  const COOLDOWN_TIME = 5;

  const icons = [Star, Zap,Flame, Trophy, Crown, Gem ]; // repeatable icon set
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

useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);


      // Fetch level info using level_id
      if (user.level_id) {
        getLevelById(user.level_id).then(response => {
          setUserLevel(response.data.level_number);
        });
      } else {
        setUserLevel(0);
      }


    }
    

    try {
      const res = await userinfo();
      // Axios: response data is in res.data
      setIsAdmin(res.data.isAdmin); 
      console.log('isAdmin:', res.data.isAdmin);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };



  fetchUser();
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
  updateUserLevel(levelNumber).then(() => {
    setUserLevel(levelNumber);
    const user = JSON.parse(localStorage.getItem('user')); 
    const updatedUser = { ...user, level_id: levelNumber };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  });
};


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveLevel = async () => {
  try {
    await addLevel(newLevel); // This sends the data to your backend
    alert('Level added!');
    setShowAddCard(false); // Hide the form after saving
    setNewLevel({
      name: '',
      description: '',
      level_number: '',
      unlock_price: '',
      money_per_day: '',

    });
    await fetchLevels(); // Refresh the levels list
    // Optionally: Refresh your level list here
  } catch (error) {
    alert('Failed to add level: ' + (error.response?.data?.message || 'Unexpected error'));
    console.error(error);
  }
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


        {/* Add Level Form Card */}
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
              <button
                onClick={() => handleUnlockLevel(level.level_number)}
                className={styles.unlockButton}
              >
                <Unlock size={16} />
                Unlock Level ({level.unlock_price}$)
              </button>
            )}

            {/* Glow Effect */}
            {isUnlocked && (
              <div className={`${styles.levelGlow} shadow-indigo-500/50`} />
            )}

            {/* ✅ Admin Edit/Delete Buttons */}
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
   
                          fetchLevels(); // Refresh the levels list
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
