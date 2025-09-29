import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './FinancialAvatar.css';

const FinancialAvatar = ({ financialData, size = 'medium' }) => {
  const [avatarState, setAvatarState] = useState(null);
  const [mood, setMood] = useState('neutral');

  useEffect(() => {
    if (!financialData) return;

    // Calculate financial health score
    const calculateHealthScore = () => {
      const surplus = financialData.monthlyIncome - financialData.monthlyExpenses;
      const surplusRatio = surplus / financialData.monthlyIncome;
      const emergencyMonths = financialData.balance / financialData.monthlyExpenses;
      const savingsRate = financialData.savingsRate;

      // Weighted scoring (0-100)
      let score = 0;
      
      // Surplus ratio (30% weight)
      if (surplusRatio > 0.3) score += 30;
      else if (surplusRatio > 0.2) score += 25;
      else if (surplusRatio > 0.1) score += 20;
      else if (surplusRatio > 0) score += 15;
      else score += 0;

      // Emergency fund (35% weight)
      if (emergencyMonths >= 6) score += 35;
      else if (emergencyMonths >= 3) score += 25;
      else if (emergencyMonths >= 1) score += 15;
      else score += 5;

      // Savings rate (35% weight)
      if (savingsRate >= 0.25) score += 35;
      else if (savingsRate >= 0.15) score += 25;
      else if (savingsRate >= 0.1) score += 15;
      else if (savingsRate >= 0.05) score += 10;
      else score += 0;

      return Math.min(100, score);
    };

    const healthScore = calculateHealthScore();
    
    // Determine avatar state based on health score
    let newAvatarState, newMood;
    
    if (healthScore >= 80) {
      newAvatarState = {
        face: '😊',
        eyes: '✨',
        expression: 'Excellent!',
        color: '#4ECDC4',
        message: "You're crushing your financial goals!",
        energy: 'high'
      };
      newMood = 'excellent';
    } else if (healthScore >= 65) {
      newAvatarState = {
        face: '😌',
        eyes: '😊',
        expression: 'Good job!',
        color: '#96CEB4',
        message: "You're on the right track!",
        energy: 'good'
      };
      newMood = 'good';
    } else if (healthScore >= 45) {
      newAvatarState = {
        face: '😐',
        eyes: '🤔',
        expression: 'Not bad',
        color: '#FFEAA7',
        message: "Room for improvement, but you're doing okay.",
        energy: 'neutral'
      };
      newMood = 'neutral';
    } else if (healthScore >= 25) {
      newAvatarState = {
        face: '😟',
        eyes: '😕',
        expression: 'Concerned',
        color: '#FFB74D',
        message: "Let's work on improving your financial health.",
        energy: 'concerned'
      };
      newMood = 'concerned';
    } else {
      newAvatarState = {
        face: '😰',
        eyes: '😨',
        expression: 'Needs help',
        color: '#FF6B6B',
        message: "Time to take action on your finances!",
        energy: 'stressed'
      };
      newMood = 'stressed';
    }

    setAvatarState({ ...newAvatarState, healthScore });
    setMood(newMood);
  }, [financialData]);

  if (!avatarState) {
    return (
      <div className={`financial-avatar ${size} loading`}>
        <div className="avatar-face">🤖</div>
      </div>
    );
  }

  const getAvatarAnimation = () => {
    switch (avatarState.energy) {
      case 'high':
        return {
          scale: [1, 1.05, 1],
          rotate: [0, 2, 0, -2, 0],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        };
      case 'good':
        return {
          scale: [1, 1.02, 1],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        };
      case 'neutral':
        return {
          y: [0, -2, 0],
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        };
      case 'concerned':
        return {
          x: [-1, 1, -1],
          transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        };
      case 'stressed':
        return {
          rotate: [-1, 1, -1],
          scale: [1, 0.98, 1],
          transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
        };
      default:
        return {};
    }
  };

  return (
    <div className={`financial-avatar ${size} ${mood}`}>
      <motion.div 
        className="avatar-container"
        animate={getAvatarAnimation()}
      >
        {/* Avatar Face */}
        <div 
          className="avatar-face"
          style={{ borderColor: avatarState.color }}
        >
          <div className="avatar-head">
            <div className="avatar-hair"></div>
            <div className="avatar-face-shape">
              <div className="avatar-eyes">
                <div className="eye left-eye">
                  <div className="pupil"></div>
                </div>
                <div className="eye right-eye">
                  <div className="pupil"></div>
                </div>
              </div>
              <div className="avatar-nose"></div>
              <div className={`avatar-mouth ${mood}`}></div>
            </div>
          </div>
        </div>

        {/* Health Score Ring */}
        <div className="health-score-ring">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke={avatarState.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 48}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 48 * (1 - avatarState.healthScore / 100) 
              }}
              transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>

        {/* Floating Emojis */}
        {avatarState.energy === 'high' && (
          <div className="floating-emojis">
            {['💚', '✨', '🎉'].map((emoji, i) => (
              <motion.div
                key={emoji}
                className="floating-emoji"
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: "easeInOut"
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        )}

        {avatarState.energy === 'stressed' && (
          <div className="stress-indicators">
            {['💦', '😰', '💸'].map((emoji, i) => (
              <motion.div
                key={emoji}
                className="stress-emoji"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                  x: [0, Math.random() * 10 - 5, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Avatar Info */}
      <div className="avatar-info">
        <motion.div 
          className="avatar-expression"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {avatarState.expression}
        </motion.div>
        
        {size !== 'small' && (
          <motion.div 
            className="avatar-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {avatarState.message}
          </motion.div>
        )}

        <motion.div 
          className="health-score-text"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <span className="score-number">{avatarState.healthScore}</span>
          <span className="score-label">Health Score</span>
        </motion.div>
      </div>
    </div>
  );
};

export default FinancialAvatar; 