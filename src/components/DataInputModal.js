import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CSVUploader from './CSVUploader';
import ManualEntry from './ManualEntry';
import './DataInputModal.css';

const DataInputModal = ({ isOpen, onClose, onDataSubmit }) => {
  const [activeTab, setActiveTab] = useState('welcome');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDataSubmit = async (data) => {
    setIsProcessing(true);
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    onDataSubmit(data);
    setIsProcessing(false);
    onClose();
  };

  const handleDemoData = () => {
    const demoData = {
      balance: 4250.75,
      monthlyIncome: 3200,
      monthlyExpenses: 2850,
      savingsRate: 0.15,
      categories: [
        { name: 'Food', amount: 650, color: '#FF6B6B', percentage: 23 },
        { name: 'Transport', amount: 320, color: '#4ECDC4', percentage: 11 },
        { name: 'Entertainment', amount: 280, color: '#45B7D1', percentage: 10 },
        { name: 'Shopping', amount: 450, color: '#96CEB4', percentage: 16 },
        { name: 'Bills', amount: 850, color: '#FFEAA7', percentage: 30 },
        { name: 'Other', amount: 300, color: '#DDA0DD', percentage: 10 }
      ]
    };
    handleDataSubmit(demoData);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="data-input-modal glass"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to Financial Time Machine
            </motion.h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>

          {/* Content */}
          <div className="modal-content">
            <AnimatePresence mode="wait">
              {activeTab === 'welcome' && (
                <motion.div
                  key="welcome"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="welcome-screen"
                >
                  <motion.div 
                    className="welcome-icon"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🚀
                  </motion.div>
                  
                  <h3>How would you like to add your financial data?</h3>
                  <p className="privacy-message">
                    🔒 Your data never leaves your device. All processing happens locally in your browser.
                  </p>

                  <div className="option-cards">
                    <motion.div
                      className="option-card"
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('upload')}
                    >
                      <div className="option-icon">📄</div>
                      <h4>Upload CSV File</h4>
                      <p>Import your bank statement or export from budgeting apps</p>
                      <div className="option-badge">Recommended</div>
                    </motion.div>

                    <motion.div
                      className="option-card"
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('manual')}
                    >
                      <div className="option-icon">✏️</div>
                      <h4>Enter Manually</h4>
                      <p>Input your income, expenses, and savings manually</p>
                    </motion.div>

                    <motion.div
                      className="option-card demo-card"
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDemoData}
                    >
                      <div className="option-icon">🎭</div>
                      <h4>Use Demo Data</h4>
                      <p>Explore the app with sample financial data</p>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'upload' && (
                <motion.div
                  key="upload"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="tab-header">
                    <motion.button 
                      className="back-button"
                      onClick={() => setActiveTab('welcome')}
                      whileHover={{ scale: 1.05, x: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      ← Back
                    </motion.button>
                    <h3>Upload Your Financial Data</h3>
                  </div>
                  <CSVUploader 
                    onDataParsed={handleDataSubmit}
                    isProcessing={isProcessing}
                  />
                </motion.div>
              )}

              {activeTab === 'manual' && (
                <motion.div
                  key="manual"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="tab-header">
                    <motion.button 
                      className="back-button"
                      onClick={() => setActiveTab('welcome')}
                      whileHover={{ scale: 1.05, x: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      ← Back
                    </motion.button>
                    <h3>Enter Your Financial Information</h3>
                  </div>
                  <ManualEntry 
                    onDataSubmit={handleDataSubmit}
                    isProcessing={isProcessing}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Processing Overlay */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                className="processing-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="processing-content">
                  <motion.div
                    className="processing-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⚡
                  </motion.div>
                  <h3>Processing Your Data...</h3>
                  <p>Creating your personalized financial insights</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DataInputModal; 