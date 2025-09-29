import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './WeatherFaceAvatar.css';

const WeatherFaceAvatar = ({ financialData, size = 'medium' }) => {
  const [avatarState, setAvatarState] = useState(null);

  useEffect(() => {
    if (!financialData) return;

    // Simple calculation for financial health
    const surplus = financialData.monthlyIncome - financialData.monthlyExpenses;
    const emergencyMonths = financialData.balance / financialData.monthlyExpenses;
    const savingsRate = financialData.savingsRate;

    // Simple scoring
    let healthScore = 0;
    if (surplus > 0) healthScore += 40;
    if (emergencyMonths >= 3) healthScore += 30;
    if (savingsRate >= 0.15) healthScore += 30;

    // Determine face and weather
    const isGood = healthScore >= 60;
    
    setAvatarState({
      isGood,
      healthScore,
      face: isGood ? 'happy' : 'sad',
      weather: isGood ? 'sunny' : 'rainy',
      message: isGood 
        ? "You're doing great! 😊" 
        : "Let's improve your finances! 💪"
    });
  }, [financialData]);

  if (!avatarState) {
    return (
      <div className={`weather-face-avatar ${size} loading`}>
        <div className="avatar-face">
          <div className="loading-dots">...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`weather-face-avatar ${size} ${avatarState.face}`}>
      {/* Weather Background */}
      <div className={`weather-overlay ${avatarState.weather}`}>
        {avatarState.weather === 'sunny' && (
          <>
            <motion.div 
              className="sun"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ☀️
            </motion.div>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="sun-ray"
                style={{
                  transform: `rotate(${i * 60}deg) translateY(-25px)`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}
        
        {avatarState.weather === 'rainy' && (
          <>
            <motion.div 
              className="cloud"
              animate={{
                x: [0, 5, 0],
                y: [0, -2, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              ☁️
            </motion.div>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="rain-drop"
                style={{
                  left: `${20 + i * 10}%`,
                  animationDelay: `${i * 0.1}s`
                }}
                animate={{
                  y: [0, 30],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "linear"
                }}
              >
                💧
              </motion.div>
            ))}
          </>
        )}
      </div>

      {/* Face */}
      <motion.div 
        className="avatar-face"
        animate={{
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Eyebrows */}
        <div className="eyebrows">
          <div className={`eyebrow left ${avatarState.face}`} />
          <div className={`eyebrow right ${avatarState.face}`} />
        </div>

        {/* Eyes */}
        <div className="eyes">
          <motion.div 
            className={`eye ${avatarState.face}`}
            animate={avatarState.face === 'happy' ? {
              scaleY: [0.6, 0.3, 0.6]
            } : {}}
            transition={avatarState.face === 'happy' ? {
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2
            } : {}}
          />
          <motion.div 
            className={`eye ${avatarState.face}`}
            animate={avatarState.face === 'happy' ? {
              scaleY: [0.6, 0.3, 0.6]
            } : {}}
            transition={avatarState.face === 'happy' ? {
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              delay: 0.1
            } : {}}
          />
        </div>

        {/* Mouth */}
        <motion.div 
          className={`mouth ${avatarState.face}`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        />

        {/* Cheeks for happy face */}
        {avatarState.face === 'happy' && (
          <div className="cheeks">
            <motion.div 
              className="cheek left"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="cheek right"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.1
              }}
            />
          </div>
        )}
      </motion.div>

      {/* Health Score */}
      <motion.div 
        className="health-score"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {avatarState.healthScore}/100
      </motion.div>

      {/* Message */}
      <motion.div 
        className="avatar-message"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        {avatarState.message}
      </motion.div>
    </div>
  );
};

export default WeatherFaceAvatar; 