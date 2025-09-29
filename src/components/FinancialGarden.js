import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FinancialGarden.css';

const FinancialGarden = ({ savingsRate, expanded = false }) => {
  const [gardenState, setGardenState] = useState({
    plants: [],
    soil: 'healthy',
    weather: 'sunny',
    season: 'spring'
  });
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [gardenStats, setGardenStats] = useState({
    totalPlants: 0,
    healthyPlants: 0,
    gardenLevel: 1,
    experience: 0
  });

  useEffect(() => {
    // Generate garden based on savings rate and financial health
    const generateGarden = () => {
      const plants = [];
      const plantCount = Math.min(Math.max(Math.floor(savingsRate * 20), 1), 12);
      
      // Plant types based on financial performance
      const plantTypes = [
        { 
          emoji: '🌱', 
          name: 'Savings Sprout', 
          health: savingsRate > 0.1 ? 'thriving' : 'growing',
          description: 'Your basic savings are taking root'
        },
        { 
          emoji: '🌿', 
          name: 'Budget Fern', 
          health: savingsRate > 0.15 ? 'thriving' : 'healthy',
          description: 'Careful budgeting helps this plant flourish'
        },
        { 
          emoji: '🌸', 
          name: 'Investment Blossom', 
          health: savingsRate > 0.2 ? 'blooming' : 'budding',
          description: 'Your investments are starting to flower'
        },
        { 
          emoji: '🌳', 
          name: 'Wealth Tree', 
          health: savingsRate > 0.25 ? 'mighty' : 'growing',
          description: 'Long-term wealth building in progress'
        },
        { 
          emoji: '🌻', 
          name: 'Goal Sunflower', 
          health: savingsRate > 0.3 ? 'radiant' : 'reaching',
          description: 'Your financial goals are reaching for the sky'
        }
      ];

      for (let i = 0; i < plantCount; i++) {
        const plantType = plantTypes[Math.min(i, plantTypes.length - 1)];
        const x = 15 + (i % 4) * 20 + Math.random() * 10;
        const y = 60 + Math.floor(i / 4) * 25 + Math.random() * 10;
        
        plants.push({
          id: i,
          ...plantType,
          x: Math.min(x, 85),
          y: Math.min(y, 85),
          size: 0.8 + Math.random() * 0.4,
          swaySpeed: 2 + Math.random() * 2,
          growthStage: Math.min(Math.floor(savingsRate * 10), 3)
        });
      }

      return plants;
    };

    const plants = generateGarden();
    setGardenState(prev => ({
      ...prev,
      plants,
      soil: savingsRate > 0.2 ? 'rich' : savingsRate > 0.1 ? 'healthy' : 'dry',
      weather: savingsRate > 0.25 ? 'perfect' : savingsRate > 0.15 ? 'sunny' : 'cloudy'
    }));

    setGardenStats({
      totalPlants: plants.length,
      healthyPlants: plants.filter(p => p.health === 'thriving' || p.health === 'blooming').length,
      gardenLevel: Math.floor(savingsRate * 10) + 1,
      experience: Math.floor(savingsRate * 1000)
    });
  }, [savingsRate]);

  const getPlantScale = (plant) => {
    const baseScale = plant.size;
    const healthMultiplier = {
      'growing': 0.8,
      'healthy': 1.0,
      'thriving': 1.2,
      'blooming': 1.3,
      'budding': 0.9,
      'reaching': 1.1,
      'radiant': 1.4,
      'mighty': 1.5
    };
    return baseScale * (healthMultiplier[plant.health] || 1.0);
  };

  const getWeatherEmoji = () => {
    switch (gardenState.weather) {
      case 'perfect': return '🌞';
      case 'sunny': return '☀️';
      case 'cloudy': return '⛅';
      case 'rainy': return '🌧️';
      default: return '☀️';
    }
  };

  const getSoilColor = () => {
    switch (gardenState.soil) {
      case 'rich': return '#8B4513';
      case 'healthy': return '#A0522D';
      case 'dry': return '#D2B48C';
      default: return '#A0522D';
    }
  };

  return (
    <div className={`financial-garden ${expanded ? 'expanded' : ''}`}>
      {/* Garden Container */}
      <div className="garden-container">
        {/* Sky Background */}
        <div className="garden-sky">
          <motion.div 
            className="weather-icon"
            animate={{
              scale: [1, 1.1, 1],
              rotate: gardenState.weather === 'sunny' ? [0, 5, 0] : 0
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {getWeatherEmoji()}
          </motion.div>
          
          {/* Floating particles (pollen, leaves, etc.) */}
          <div className="garden-particles">
            {[...Array(expanded ? 15 : 8)].map((_, i) => (
              <motion.div
                key={i}
                className="garden-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 50 - 25],
                  y: [0, Math.random() * 30 - 15],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2
                }}
              >
                {['🌸', '🍃', '✨', '🦋'][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Soil Base */}
        <div 
          className="garden-soil"
          style={{ backgroundColor: getSoilColor() }}
        />

        {/* Plants */}
        <div className="plants-container">
          {gardenState.plants.map((plant) => (
            <motion.div
              key={plant.id}
              className={`garden-plant ${plant.health}`}
              style={{
                left: `${plant.x}%`,
                top: `${plant.y}%`,
                fontSize: `${1.5 + plant.size * 0.5}rem`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: getPlantScale(plant), 
                opacity: 1,
                rotate: [0, 2, 0, -2, 0]
              }}
              transition={{
                scale: { delay: plant.id * 0.1, duration: 0.8 },
                opacity: { delay: plant.id * 0.1, duration: 0.8 },
                rotate: {
                  duration: plant.swaySpeed,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{ 
                scale: getPlantScale(plant) * 1.1,
                transition: { duration: 0.2 }
              }}
              onClick={() => setSelectedPlant(selectedPlant === plant.id ? null : plant.id)}
            >
              <span className="plant-emoji">{plant.emoji}</span>
              
              {/* Plant glow effect */}
              <motion.div 
                className="plant-glow"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Growth rings */}
              {plant.growthStage > 1 && (
                <motion.div 
                  className="growth-ring"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Garden Level Badge */}
        <motion.div 
          className="garden-level"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span className="level-icon">🏆</span>
          <span className="level-text">Level {gardenStats.gardenLevel}</span>
        </motion.div>
      </div>

      {/* Plant Details Panel */}
      <AnimatePresence>
        {selectedPlant !== null && (
          <motion.div
            className="plant-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {(() => {
              const plant = gardenState.plants.find(p => p.id === selectedPlant);
              return plant ? (
                <div className="plant-info">
                  <div className="plant-header">
                    <span className="plant-icon">{plant.emoji}</span>
                    <div>
                      <h4>{plant.name}</h4>
                      <span className={`plant-status ${plant.health}`}>
                        {plant.health.charAt(0).toUpperCase() + plant.health.slice(1)}
                      </span>
                    </div>
                  </div>
                  <p className="plant-description">{plant.description}</p>
                  <div className="plant-progress">
                    <span>Growth Stage: {plant.growthStage}/3</span>
                    <div className="progress-bar">
                      <motion.div 
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(plant.growthStage / 3) * 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Garden Stats */}
      {!expanded && (
        <motion.div 
          className="garden-summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="summary-stat">
            <span className="stat-icon">🌱</span>
            <span className="stat-value">{gardenStats.totalPlants}</span>
            <span className="stat-label">Plants</span>
          </div>
          <div className="summary-stat">
            <span className="stat-icon">💚</span>
            <span className="stat-value">{gardenStats.healthyPlants}</span>
            <span className="stat-label">Healthy</span>
          </div>
        </motion.div>
      )}

      {/* Expanded View Features */}
      {expanded && (
        <motion.div 
          className="garden-expanded-info"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <div className="garden-metrics">
            <div className="metric-card">
              <span className="metric-icon">🌿</span>
              <div className="metric-content">
                <span className="metric-value">{gardenStats.totalPlants}</span>
                <span className="metric-label">Total Plants</span>
              </div>
            </div>
            <div className="metric-card">
              <span className="metric-icon">💚</span>
              <div className="metric-content">
                <span className="metric-value">{gardenStats.healthyPlants}</span>
                <span className="metric-label">Thriving</span>
              </div>
            </div>
            <div className="metric-card">
              <span className="metric-icon">⭐</span>
              <div className="metric-content">
                <span className="metric-value">{gardenStats.experience}</span>
                <span className="metric-label">XP Points</span>
              </div>
            </div>
          </div>

          <div className="garden-tips">
            <h4>🌱 Garden Tips</h4>
            <div className="tips-grid">
              <div className="tip-card">
                <span className="tip-icon">💧</span>
                <span className="tip-text">
                  {savingsRate > 0.2 
                    ? "Your garden is well-watered! Keep up the great savings habits."
                    : "Water your garden more by increasing your savings rate to 20%."
                  }
                </span>
              </div>
              <div className="tip-card">
                <span className="tip-icon">☀️</span>
                <span className="tip-text">
                  Plant new seeds by setting up automatic transfers to savings.
                </span>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🌸</span>
                <span className="tip-text">
                  Watch your investments bloom by diversifying your portfolio.
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FinancialGarden; 