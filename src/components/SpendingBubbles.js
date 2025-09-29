import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SpendingBubbles.css';

const SpendingBubbles = ({ categories, expanded = false }) => {
  const [selectedBubble, setSelectedBubble] = useState(null);
  const [bubbles, setBubbles] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    // Generate bubble positions and animations
    const generateBubbles = () => {
      const containerWidth = expanded ? 600 : 300;
      const containerHeight = expanded ? 400 : 200;
      
      return categories.map((category, index) => {
        // Calculate bubble size based on spending amount
        const maxAmount = Math.max(...categories.map(c => c.amount));
        const minSize = expanded ? 40 : 30;
        const maxSize = expanded ? 120 : 80;
        const size = minSize + (category.amount / maxAmount) * (maxSize - minSize);
        
        // Generate random but aesthetically pleasing positions
        const angle = (index / categories.length) * 2 * Math.PI;
        const radius = expanded ? 150 : 80;
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        
        const x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 60;
        const y = centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 60;
        
        return {
          ...category,
          id: index,
          size,
          x: Math.max(size/2, Math.min(containerWidth - size/2, x)),
          y: Math.max(size/2, Math.min(containerHeight - size/2, y)),
          floatSpeed: 2 + Math.random() * 3,
          floatRange: 10 + Math.random() * 20
        };
      });
    };

    setBubbles(generateBubbles());
  }, [categories, expanded]);

  const getBubbleVariants = (bubble) => ({
    initial: { 
      scale: 0, 
      opacity: 0,
      x: bubble.x,
      y: bubble.y
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      x: bubble.x,
      y: bubble.y,
      transition: {
        delay: bubble.id * 0.1,
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.1,
      z: 10,
      transition: { duration: 0.2 }
    },
    float: {
      y: [bubble.y - bubble.floatRange, bubble.y + bubble.floatRange],
      transition: {
        duration: bubble.floatSpeed,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  });

  const totalSpending = categories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <div className={`spending-bubbles ${expanded ? 'expanded' : ''}`}>
      <div className="bubbles-container" ref={containerRef}>
        {/* Background gradient effect */}
        <div className="bubbles-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        {/* Spending Bubbles */}
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              className="spending-bubble"
              style={{
                width: bubble.size,
                height: bubble.size,
                background: `radial-gradient(circle at 30% 30%, ${bubble.color}dd, ${bubble.color}88)`,
                boxShadow: `0 0 ${bubble.size/2}px ${bubble.color}44, inset 0 0 ${bubble.size/4}px rgba(255,255,255,0.3)`
              }}
              variants={getBubbleVariants(bubble)}
              initial="initial"
              animate={["animate", "float"]}
              whileHover="hover"
              onClick={() => setSelectedBubble(selectedBubble === bubble.id ? null : bubble.id)}
            >
              {/* Bubble Content */}
              <div className="bubble-content">
                <span className="bubble-category">{bubble.name}</span>
                <span className="bubble-amount">${bubble.amount}</span>
                <span className="bubble-percentage">{bubble.percentage}%</span>
              </div>

              {/* Bubble Shine Effect */}
              <div className="bubble-shine"></div>

              {/* Bubble Ripple Effect */}
              <motion.div 
                className="bubble-ripple"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Connection Lines */}
        {expanded && (
          <svg className="bubble-connections" width="100%" height="100%">
            {bubbles.map((bubble, index) => 
              bubbles.slice(index + 1).map((otherBubble, otherIndex) => (
                <motion.line
                  key={`${index}-${otherIndex}`}
                  x1={bubble.x}
                  y1={bubble.y}
                  x2={otherBubble.x}
                  y2={otherBubble.y}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ delay: 1 + index * 0.1, duration: 1 }}
                />
              ))
            )}
          </svg>
        )}
      </div>

      {/* Bubble Details Panel */}
      <AnimatePresence>
        {selectedBubble !== null && (
          <motion.div
            className="bubble-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {(() => {
              const bubble = bubbles.find(b => b.id === selectedBubble);
              return bubble ? (
                <div className="details-content">
                  <h4 style={{ color: bubble.color }}>{bubble.name}</h4>
                  <div className="details-stats">
                    <div className="detail-item">
                      <span className="detail-label">Amount</span>
                      <span className="detail-value">${bubble.amount.toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Percentage</span>
                      <span className="detail-value">{bubble.percentage}%</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">vs Total</span>
                      <span className="detail-value">
                        ${(totalSpending - bubble.amount).toLocaleString()} remaining
                      </span>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Stats */}
      {!expanded && (
        <motion.div 
          className="spending-summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="summary-item">
            <span className="summary-label">Total Spending</span>
            <span className="summary-value">${totalSpending.toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Categories</span>
            <span className="summary-value">{categories.length}</span>
          </div>
        </motion.div>
      )}

      {/* Expanded View Additional Features */}
      {expanded && (
        <motion.div 
          className="spending-insights"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <h4>Spending Insights</h4>
          <div className="insights-grid">
            <div className="insight-card">
              <span className="insight-icon">🎯</span>
              <span className="insight-text">
                {categories[0].name} is your largest expense
              </span>
            </div>
            <div className="insight-card">
              <span className="insight-icon">📊</span>
              <span className="insight-text">
                Top 3 categories: {Math.round(categories.slice(0, 3).reduce((sum, cat) => sum + cat.percentage, 0))}% of spending
              </span>
            </div>
            <div className="insight-card">
              <span className="insight-icon">💡</span>
              <span className="insight-text">
                Consider reducing {categories.find(c => c.percentage > 25)?.name || 'discretionary'} spending
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SpendingBubbles; 