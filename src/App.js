import React from 'react';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="App">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="app-container"
      >
        <Dashboard />
      </motion.div>
    </div>
  );
}

export default App; 