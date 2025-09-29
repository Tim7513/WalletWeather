import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './FinancialWeather.css';

const FinancialWeather = ({ data, expanded = false }) => {
  const [weather, setWeather] = useState(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Calculate financial weather based on data
    const calculateWeather = () => {
      const surplus = data.monthlyIncome - data.monthlyExpenses;
      const surplusRatio = surplus / data.monthlyIncome;
      const balanceToExpenseRatio = data.balance / data.monthlyExpenses;

      let weatherType, temperature, description, color, emoji;

      if (surplusRatio > 0.2 && balanceToExpenseRatio > 6) {
        weatherType = 'sunny';
        temperature = 85;
        description = 'Perfect financial weather! Your money is growing beautifully.';
        color = '#FFD700';
        emoji = '☀️';
      } else if (surplusRatio > 0.1 && balanceToExpenseRatio > 3) {
        weatherType = 'partly-cloudy';
        temperature = 72;
        description = 'Mostly sunny with some clouds. Good financial health overall.';
        color = '#FFA500';
        emoji = '⛅';
      } else if (surplusRatio > 0 && balanceToExpenseRatio > 1) {
        weatherType = 'cloudy';
        temperature = 58;
        description = 'Cloudy skies ahead. Consider optimizing your spending.';
        color = '#87CEEB';
        emoji = '☁️';
      } else if (surplusRatio > -0.1) {
        weatherType = 'rainy';
        temperature = 45;
        description = 'Financial storm approaching. Time to take shelter and budget.';
        color = '#4682B4';
        emoji = '🌧️';
      } else {
        weatherType = 'stormy';
        temperature = 32;
        description = 'Financial hurricane! Emergency budgeting mode activated.';
        color = '#2F4F4F';
        emoji = '⛈️';
      }

      return { weatherType, temperature, description, color, emoji };
    };

    setWeather(calculateWeather());
  }, [data]);

  useEffect(() => {
    // Generate weather particles
    if (weather) {
      const newParticles = [];
      const particleCount = expanded ? 30 : 15;
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          speed: Math.random() * 2 + 1,
          opacity: Math.random() * 0.7 + 0.3
        });
      }
      setParticles(newParticles);
    }
  }, [weather, expanded]);

  if (!weather) return <div>Loading weather...</div>;

  const getWeatherAnimation = () => {
    switch (weather.weatherType) {
      case 'sunny':
        return {
          rotate: [0, 360],
          scale: [1, 1.1, 1],
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        };
      case 'partly-cloudy':
        return {
          x: [-5, 5, -5],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        };
      case 'cloudy':
        return {
          y: [-3, 3, -3],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        };
      case 'rainy':
        return {
          y: [0, -5, 0],
          transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        };
      case 'stormy':
        return {
          rotate: [-2, 2, -2],
          scale: [1, 1.05, 1],
          transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
        };
      default:
        return {};
    }
  };

  return (
    <div className={`financial-weather ${expanded ? 'expanded' : ''}`}>
      <div className="weather-container">
        {/* Weather Icon */}
        <motion.div 
          className="weather-icon"
          animate={getWeatherAnimation()}
          style={{ color: weather.color }}
        >
          <span className="weather-emoji">{weather.emoji}</span>
        </motion.div>

        {/* Temperature Display */}
        <motion.div 
          className="temperature-display"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="temperature">{weather.temperature}°</span>
          <span className="temperature-label">Financial Health</span>
        </motion.div>

        {/* Weather Particles */}
        <div className="weather-particles">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className={`weather-particle ${weather.weatherType}`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity
              }}
              animate={{
                y: weather.weatherType === 'rainy' || weather.weatherType === 'stormy' 
                  ? [0, 100] : [-10, 10, -10],
                x: weather.weatherType === 'sunny' 
                  ? [0, 20, 0] : [-5, 5, -5]
              }}
              transition={{
                duration: particle.speed,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* Weather Description */}
      <motion.div 
        className="weather-description"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <p>{weather.description}</p>
      </motion.div>

      {/* Financial Metrics */}
      {expanded && (
        <motion.div 
          className="weather-metrics"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div className="metric">
            <span className="metric-label">Monthly Surplus</span>
            <span className="metric-value">
              ${(data.monthlyIncome - data.monthlyExpenses).toLocaleString()}
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">Emergency Fund</span>
            <span className="metric-value">
              {(data.balance / data.monthlyExpenses).toFixed(1)} months
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">Savings Rate</span>
            <span className="metric-value">
              {(data.savingsRate * 100).toFixed(1)}%
            </span>
          </div>
        </motion.div>
      )}

      {/* Weather Forecast */}
      {expanded && (
        <motion.div 
          className="weather-forecast"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <h4>Financial Forecast</h4>
          <div className="forecast-items">
            <div className="forecast-item">
              <span className="forecast-period">Next Month</span>
              <span className="forecast-weather">⛅ Partly Cloudy</span>
              <span className="forecast-temp">75°</span>
            </div>
            <div className="forecast-item">
              <span className="forecast-period">3 Months</span>
              <span className="forecast-weather">☀️ Sunny</span>
              <span className="forecast-temp">82°</span>
            </div>
            <div className="forecast-item">
              <span className="forecast-period">6 Months</span>
              <span className="forecast-weather">☀️ Sunny</span>
              <span className="forecast-temp">88°</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FinancialWeather; 