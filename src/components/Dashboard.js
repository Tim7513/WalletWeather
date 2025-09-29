import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FinancialWeather from './FinancialWeather';
import SpendingBubbles from './SpendingBubbles';
import AIInsights from './AIInsights';
import FinancialGarden from './FinancialGarden';
import DataInputModal from './DataInputModal';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showDataModal, setShowDataModal] = useState(false);
  const [financialData, setFinancialData] = useState(null);

  // Check for existing data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('financialTimeData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFinancialData(parsedData);
      } catch (error) {
        console.error('Error parsing saved data:', error);
        setShowDataModal(true);
      }
    } else {
      setShowDataModal(true);
    }
  }, []);

  const handleDataSubmit = (data) => {
    // Save to localStorage
    localStorage.setItem('financialTimeData', JSON.stringify(data));
    setFinancialData(data);
    setShowDataModal(false);
  };

  const handleDataReset = () => {
    localStorage.removeItem('financialTimeData');
    setFinancialData(null);
    setShowDataModal(true);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Show loading or data input modal if no data
  if (!financialData) {
    return (
      <>
        <div className="dashboard-loading">
          <motion.div
            className="loading-content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="loading-icon">⚡</div>
            <h2>Financial Time Machine</h2>
            <p>Preparing your personalized financial dashboard...</p>
          </motion.div>
        </div>
        <DataInputModal
          isOpen={showDataModal}
          onClose={() => setShowDataModal(false)}
          onDataSubmit={handleDataSubmit}
        />
      </>
    );
  }

  return (
    <motion.div 
      className="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating Particles Background */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${Math.random() * 10 + 15}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="dashboard-header glass"
        variants={cardVariants}
        custom={0}
      >
        <div className="header-content">
          <motion.h1 
            className="dashboard-title"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Financial Time Machine
          </motion.h1>
          <motion.p 
            className="dashboard-subtitle"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Your personalized financial insights powered by AI
          </motion.p>
        </div>
        <div className="header-actions">
          <motion.div 
            className="balance-display"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <span className="balance-label">Current Balance</span>
            <motion.span 
              className="balance-amount"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              ${financialData.balance.toLocaleString()}
            </motion.span>
          </motion.div>
          <motion.button
            className="reset-data-btn"
            onClick={handleDataReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            🔄 Update Data
          </motion.button>
        </div>
      </motion.header>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Financial Weather Card */}
        <motion.div
          className="dashboard-card glass"
          variants={cardVariants}
          custom={1}
          whileHover="hover"
          onClick={() => setSelectedCard('weather')}
        >
          <div className="card-header">
            <h3>Financial Weather</h3>
            <span className="card-icon">🌤️</span>
          </div>
          <FinancialWeather data={financialData} />
        </motion.div>

        {/* Spending Visualization */}
        <motion.div
          className="dashboard-card glass spending-card"
          variants={cardVariants}
          custom={2}
          whileHover="hover"
          onClick={() => setSelectedCard('spending')}
        >
          <div className="card-header">
            <h3>Spending Universe</h3>
            <span className="card-icon">🌌</span>
          </div>
          <SpendingBubbles categories={financialData.categories} />
        </motion.div>

        {/* AI Insights */}
        <motion.div
          className="dashboard-card glass"
          variants={cardVariants}
          custom={3}
          whileHover="hover"
          onClick={() => setSelectedCard('insights')}
        >
          <div className="card-header">
            <h3>AI Insights</h3>
            <span className="card-icon">🧠</span>
          </div>
          <AIInsights data={financialData} />
        </motion.div>

        {/* Financial Garden */}
        <motion.div
          className="dashboard-card glass garden-card"
          variants={cardVariants}
          custom={4}
          whileHover="hover"
          onClick={() => setSelectedCard('garden')}
        >
          <div className="card-header">
            <h3>Financial Garden</h3>
            <span className="card-icon">🌱</span>
          </div>
          <FinancialGarden savingsRate={financialData.savingsRate} />
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="dashboard-card glass stats-card"
          variants={cardVariants}
          custom={5}
          whileHover="hover"
        >
          <div className="card-header">
            <h3>Quick Stats</h3>
            <span className="card-icon">📊</span>
          </div>
          <div className="stats-grid">
            <motion.div 
              className="stat-item"
              whileHover={{ scale: 1.05 }}
            >
              <span className="stat-value">
                ${(financialData.monthlyIncome - financialData.monthlyExpenses).toLocaleString()}
              </span>
              <span className="stat-label">Monthly Surplus</span>
            </motion.div>
            <motion.div 
              className="stat-item"
              whileHover={{ scale: 1.05 }}
            >
              <span className="stat-value">
                {(financialData.savingsRate * 100).toFixed(1)}%
              </span>
              <span className="stat-label">Savings Rate</span>
            </motion.div>
            <motion.div 
              className="stat-item"
              whileHover={{ scale: 1.05 }}
            >
              <span className="stat-value">
                {(financialData.balance / financialData.monthlyExpenses).toFixed(1)}
              </span>
              <span className="stat-label">Months of Expenses</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Modal for expanded views */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              className="modal-content glass"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="modal-close"
                onClick={() => setSelectedCard(null)}
              >
                ✕
              </button>
              <div className="modal-body">
                {selectedCard === 'weather' && <FinancialWeather data={financialData} expanded />}
                {selectedCard === 'spending' && <SpendingBubbles categories={financialData.categories} expanded />}
                {selectedCard === 'insights' && <AIInsights data={financialData} expanded />}
                {selectedCard === 'garden' && <FinancialGarden savingsRate={financialData.savingsRate} expanded />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Input Modal */}
      <DataInputModal
        isOpen={showDataModal}
        onClose={() => setShowDataModal(false)}
        onDataSubmit={handleDataSubmit}
      />
    </motion.div>
  );
};

export default Dashboard; 