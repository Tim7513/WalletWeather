import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FullBodyAvatar.css';

const FullBodyAvatar = ({ financialData, expanded = false }) => {
  const [avatarState, setAvatarState] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (!financialData) return;

    // Calculate comprehensive financial health
    const calculateAvatarState = () => {
      const surplus = financialData.monthlyIncome - financialData.monthlyExpenses;
      const surplusRatio = surplus / financialData.monthlyIncome;
      const emergencyMonths = financialData.balance / financialData.monthlyExpenses;
      const savingsRate = financialData.savingsRate;

      // Calculate overall financial health score (0-100)
      let healthScore = 0;
      
      // Income surplus (30%)
      if (surplusRatio > 0.3) healthScore += 30;
      else if (surplusRatio > 0.2) healthScore += 25;
      else if (surplusRatio > 0.1) healthScore += 20;
      else if (surplusRatio > 0) healthScore += 15;
      else healthScore += 0;

      // Emergency fund (35%)
      if (emergencyMonths >= 6) healthScore += 35;
      else if (emergencyMonths >= 3) healthScore += 25;
      else if (emergencyMonths >= 1) healthScore += 15;
      else healthScore += 5;

      // Savings rate (35%)
      if (savingsRate >= 0.25) healthScore += 35;
      else if (savingsRate >= 0.15) healthScore += 25;
      else if (savingsRate >= 0.1) healthScore += 15;
      else if (savingsRate >= 0.05) healthScore += 10;
      else healthScore += 0;

      // Determine avatar appearance based on score
      let state;
      
      if (healthScore >= 80) {
        state = {
          mood: 'excellent',
          posture: 'confident',
          clothing: 'business-suit',
          accessories: ['briefcase', 'watch', 'smile'],
          environment: 'office-luxury',
          colors: {
            suit: '#2C3E50',
            shirt: '#ECF0F1',
            tie: '#3498DB',
            skin: '#F4D1A0',
            hair: '#8B6F47'
          },
          animations: {
            breathing: 'calm',
            stance: 'power-pose',
            gesture: 'thumbs-up'
          },
          message: "Financial success! You're building wealth steadily.",
          advice: "Consider diversifying investments and planning for long-term goals."
        };
      } else if (healthScore >= 65) {
        state = {
          mood: 'good',
          posture: 'upright',
          clothing: 'business-casual',
          accessories: ['laptop', 'coffee', 'slight-smile'],
          environment: 'modern-office',
          colors: {
            shirt: '#3498DB',
            pants: '#34495E',
            skin: '#F4D1A0',
            hair: '#8B6F47'
          },
          animations: {
            breathing: 'steady',
            stance: 'balanced',
            gesture: 'wave'
          },
          message: "You're doing well! Keep up the good habits.",
          advice: "Focus on increasing your emergency fund to 6 months."
        };
      } else if (healthScore >= 45) {
        state = {
          mood: 'neutral',
          posture: 'neutral',
          clothing: 'casual',
          accessories: ['phone', 'thinking'],
          environment: 'home-office',
          colors: {
            shirt: '#95A5A6',
            pants: '#7F8C8D',
            skin: '#F4D1A0',
            hair: '#8B6F47'
          },
          animations: {
            breathing: 'normal',
            stance: 'relaxed',
            gesture: 'chin-scratch'
          },
          message: "Room for improvement, but you're on track.",
          advice: "Try to reduce expenses and increase savings rate."
        };
      } else if (healthScore >= 25) {
        state = {
          mood: 'concerned',
          posture: 'slouched',
          clothing: 'wrinkled',
          accessories: ['papers', 'worry-lines'],
          environment: 'cluttered-desk',
          colors: {
            shirt: '#E67E22',
            pants: '#D35400',
            skin: '#F4D1A0',
            hair: '#8B6F47'
          },
          animations: {
            breathing: 'shallow',
            stance: 'unsteady',
            gesture: 'head-in-hands'
          },
          message: "Financial stress detected. Let's make a plan.",
          advice: "Start by tracking expenses and creating a budget."
        };
      } else {
        state = {
          mood: 'stressed',
          posture: 'hunched',
          clothing: 'disheveled',
          accessories: ['bills', 'stress-sweat'],
          environment: 'chaos',
          colors: {
            shirt: '#E74C3C',
            pants: '#C0392B',
            skin: '#F4D1A0',
            hair: '#8B6F47'
          },
          animations: {
            breathing: 'rapid',
            stance: 'unstable',
            gesture: 'panic'
          },
          message: "Time for immediate financial intervention!",
          advice: "Focus on essential expenses only and seek financial counseling."
        };
      }

      return { ...state, healthScore, surplus, emergencyMonths };
    };

    setIsThinking(true);
    setTimeout(() => {
      setAvatarState(calculateAvatarState());
      setIsThinking(false);
    }, 1000);
  }, [financialData]);

  if (!avatarState && !isThinking) {
    return (
      <div className="fullbody-avatar loading">
        <div className="avatar-placeholder">
          <motion.div
            className="loading-icon"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🤖
          </motion.div>
          <p>Analyzing your financial profile...</p>
        </div>
      </div>
    );
  }

  if (isThinking) {
    return (
      <div className="fullbody-avatar thinking">
        <motion.div
          className="thinking-avatar"
          animate={{
            scale: [1, 1.02, 1],
            rotate: [0, 1, -1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="avatar-silhouette">
            <div className="head">
              <div className="thinking-bubbles">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="thought-bubble"
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  >
                    💭
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="body"></div>
            <div className="legs"></div>
          </div>
        </motion.div>
        <motion.p
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Crunching your numbers...
        </motion.p>
      </div>
    );
  }

  const getAvatarAnimations = () => {
    switch (avatarState.animations.breathing) {
      case 'calm':
        return {
          scale: [1, 1.01, 1],
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        };
      case 'steady':
        return {
          scale: [1, 1.008, 1],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        };
      case 'normal':
        return {
          y: [0, -2, 0],
          transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
        };
      case 'shallow':
        return {
          scale: [1, 0.995, 1],
          y: [0, 1, 0],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        };
      case 'rapid':
        return {
          scale: [1, 0.98, 1],
          y: [0, 2, 0],
          transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        };
      default:
        return {};
    }
  };

  const getEnvironmentEffects = () => {
    switch (avatarState.environment) {
      case 'office-luxury':
        return ['💼', '🏆', '💎', '📈'];
      case 'modern-office':
        return ['💻', '📊', '☕', '📱'];
      case 'home-office':
        return ['🏠', '📚', '🖥️'];
      case 'cluttered-desk':
        return ['📄', '📋', '😰'];
      case 'chaos':
        return ['💸', '😱', '📉', '🔥'];
      default:
        return [];
    }
  };

  return (
    <div className={`fullbody-avatar ${avatarState.mood} ${expanded ? 'expanded' : ''}`}>
      {/* Environment Effects */}
      <div className="environment-effects">
        {getEnvironmentEffects().map((effect, i) => (
          <motion.div
            key={i}
            className="environment-item"
            animate={{
              y: [0, -5, 0],
              opacity: [0.6, 1, 0.6],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            style={{
              left: `${15 + i * 20}%`,
              top: `${10 + (i % 2) * 15}%`
            }}
          >
            {effect}
          </motion.div>
        ))}
      </div>

      {/* Main Avatar */}
      <motion.div
        className="avatar-main"
        animate={getAvatarAnimations()}
        style={{ zIndex: 10 }}
      >
        {/* Head */}
        <div className="avatar-head" style={{ borderColor: avatarState.colors.skin }}>
          <div className="hair" style={{ backgroundColor: avatarState.colors.hair }}></div>
          <div className="face" style={{ backgroundColor: avatarState.colors.skin }}>
            <div className="eyes">
              <div className={`eye left ${avatarState.mood}`}>
                <div className="pupil"></div>
              </div>
              <div className={`eye right ${avatarState.mood}`}>
                <div className="pupil"></div>
              </div>
            </div>
            <div className="nose"></div>
            <div className={`mouth ${avatarState.mood}`}></div>
            
            {/* Mood-specific facial features */}
            {avatarState.mood === 'concerned' && (
              <div className="worry-lines">
                <div className="worry-line left"></div>
                <div className="worry-line right"></div>
              </div>
            )}
            
            {avatarState.mood === 'stressed' && (
              <div className="stress-indicators">
                <div className="sweat-drop left">💦</div>
                <div className="sweat-drop right">💦</div>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="avatar-body">
          {/* Torso */}
          <div className="torso">
            <div 
              className={`shirt ${avatarState.clothing}`}
              style={{ backgroundColor: avatarState.colors.shirt }}
            >
              {avatarState.clothing === 'business-suit' && (
                <>
                  <div 
                    className="tie" 
                    style={{ backgroundColor: avatarState.colors.tie }}
                  ></div>
                  <div className="suit-jacket" style={{ backgroundColor: avatarState.colors.suit }}>
                    <div className="lapel left"></div>
                    <div className="lapel right"></div>
                    <div className="buttons">
                      <div className="button"></div>
                      <div className="button"></div>
                    </div>
                  </div>
                </>
              )}
              
              {avatarState.clothing === 'wrinkled' && (
                <div className="wrinkles">
                  <div className="wrinkle"></div>
                  <div className="wrinkle"></div>
                  <div className="wrinkle"></div>
                </div>
              )}
            </div>
          </div>

          {/* Arms */}
          <div className="arms">
            <motion.div 
              className={`arm left ${avatarState.animations.gesture}`}
              animate={
                avatarState.animations.gesture === 'thumbs-up' 
                  ? { rotate: [0, 10, 0] }
                  : avatarState.animations.gesture === 'head-in-hands'
                  ? { rotate: [0, -30, 0] }
                  : avatarState.animations.gesture === 'wave'
                  ? { rotate: [0, 15, -15, 0] }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="hand left">
                {avatarState.animations.gesture === 'thumbs-up' && '👍'}
                {avatarState.animations.gesture === 'wave' && '👋'}
              </div>
            </motion.div>
            
            <motion.div 
              className={`arm right ${avatarState.animations.gesture}`}
              animate={
                avatarState.animations.gesture === 'chin-scratch'
                  ? { rotate: [0, -20, 0] }
                  : {}
              }
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="hand right">
                {avatarState.accessories.includes('briefcase') && '💼'}
                {avatarState.accessories.includes('phone') && '📱'}
              </div>
            </motion.div>
          </div>

          {/* Legs */}
          <div className="legs">
            <div 
              className="pants" 
              style={{ backgroundColor: avatarState.colors.pants }}
            >
              <div className="leg left"></div>
              <div className="leg right"></div>
            </div>
            <div className="feet">
              <div className="shoe left"></div>
              <div className="shoe right"></div>
            </div>
          </div>
        </div>

        {/* Accessories */}
        <div className="accessories">
          {avatarState.accessories.includes('watch') && (
            <div className="watch">⌚</div>
          )}
          {avatarState.accessories.includes('coffee') && (
            <motion.div 
              className="coffee"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              ☕
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Health Score Ring (Large) */}
      <div className="health-score-display">
        <svg width="200" height="200" viewBox="0 0 200 200" className="health-ring">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={
              avatarState.healthScore >= 80 ? '#4ECDC4' :
              avatarState.healthScore >= 65 ? '#96CEB4' :
              avatarState.healthScore >= 45 ? '#FFEAA7' :
              avatarState.healthScore >= 25 ? '#FFB74D' : '#FF6B6B'
            }
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 90}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
            animate={{ 
              strokeDashoffset: 2 * Math.PI * 90 * (1 - avatarState.healthScore / 100) 
            }}
            transition={{ delay: 1, duration: 3, ease: "easeOut" }}
            transform="rotate(-90 100 100)"
          />
        </svg>
        
        <div className="score-text">
          <motion.div 
            className="score-number"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2, type: "spring", stiffness: 200 }}
          >
            {avatarState.healthScore}
          </motion.div>
          <div className="score-label">Financial Health</div>
        </div>
      </div>

      {/* Message & Advice */}
      <motion.div 
        className="avatar-message-panel"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.8 }}
      >
        <div className="message-bubble">
          <h3>{avatarState.message}</h3>
          <p>{avatarState.advice}</p>
          
          {expanded && (
            <div className="detailed-stats">
              <div className="stat">
                <span className="stat-label">Monthly Surplus:</span>
                <span className="stat-value">${avatarState.surplus.toLocaleString()}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Emergency Fund:</span>
                <span className="stat-value">{avatarState.emergencyMonths.toFixed(1)} months</span>
              </div>
              <div className="stat">
                <span className="stat-label">Savings Rate:</span>
                <span className="stat-value">{(financialData.savingsRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FullBodyAvatar; 