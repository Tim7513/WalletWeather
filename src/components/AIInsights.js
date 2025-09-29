import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AIInsights.css';

const AIInsights = ({ data, expanded = false }) => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    // Simulate AI analysis
    setIsAnalyzing(true);
    
    const generateInsights = () => {
      const surplus = data.monthlyIncome - data.monthlyExpenses;
      const savingsGoal = data.monthlyIncome * 0.2; // 20% savings goal
      const emergencyFundMonths = data.balance / data.monthlyExpenses;
      
      const analysisInsights = [
        {
          id: 1,
          type: 'positive',
          icon: '🎯',
          title: 'Savings Performance',
          message: surplus >= savingsGoal 
            ? `Excellent! You're exceeding your 20% savings goal by $${(surplus - savingsGoal).toLocaleString()}.`
            : surplus > 0 
            ? `You're saving $${surplus.toLocaleString()} monthly. Try to reach $${savingsGoal.toLocaleString()} (20% goal).`
            : `You're overspending by $${Math.abs(surplus).toLocaleString()} monthly.`,
          confidence: surplus >= savingsGoal ? 96 : surplus > 0 ? 85 : 65,
          action: surplus > 0 
            ? 'Consider increasing your investment allocation'
            : 'Review your largest expense categories',
          trend: surplus > 0 ? 'up' : 'down'
        },
        {
          id: 2,
          type: 'warning',
          icon: '🛡️',
          title: 'Emergency Fund Status',
          message: emergencyFundMonths >= 6 
            ? `Excellent! You have ${emergencyFundMonths.toFixed(1)} months of expenses saved.`
            : `You have ${emergencyFundMonths.toFixed(1)} months of expenses. Aim for 6 months.`,
          confidence: 88,
          action: emergencyFundMonths >= 6 
            ? 'Consider investing excess emergency funds'
            : 'Prioritize building your emergency fund',
          trend: emergencyFundMonths >= 6 ? 'stable' : 'up'
        },
        {
          id: 3,
          type: 'opportunity',
          icon: '💡',
          title: 'Optimization Opportunity',
          message: `Your largest expense (${data.categories[0].name}) could be optimized.`,
          confidence: 85,
          action: `Try reducing ${data.categories[0].name} spending by 10%`,
          trend: 'down',
          potential: `Could save $${Math.round(data.categories[0].amount * 0.1)} monthly`
        },
        {
          id: 4,
          type: 'prediction',
          icon: '🔮',
          title: 'Future Projection',
          message: `At current savings rate, you'll have $${Math.round(data.balance + surplus * 12).toLocaleString()} in 12 months.`,
          confidence: 91,
          action: 'Stay consistent with your current habits',
          trend: 'up'
        }
      ];

      return analysisInsights;
    };

    // Simulate processing delay
    setTimeout(() => {
      setInsights(generateInsights());
      setIsAnalyzing(false);
    }, 2000);
  }, [data]);

  useEffect(() => {
    // Auto-rotate insights
    if (!expanded && insights.length > 0) {
      const interval = setInterval(() => {
        setCurrentInsight((prev) => (prev + 1) % insights.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [expanded, insights.length]);

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive': return '#4ECDC4';
      case 'warning': return '#FFD93D';
      case 'opportunity': return '#6BCF7F';
      case 'prediction': return '#A8E6CF';
      default: return '#4ECDC4';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '📊';
      default: return '📊';
    }
  };

  if (isAnalyzing) {
    return (
      <div className="ai-insights analyzing">
        <div className="analyzing-container">
          <motion.div 
            className="ai-brain"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🧠
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            AI analyzing your financial patterns...
          </motion.p>
          <div className="analyzing-dots">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="dot"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ai-insights ${expanded ? 'expanded' : ''}`}>
      {!expanded ? (
        // Compact view - rotating insights
        <AnimatePresence mode="wait">
          <motion.div
            key={currentInsight}
            className="insight-card compact"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            {insights[currentInsight] && (
              <>
                <div className="insight-header">
                  <span className="insight-icon">
                    {insights[currentInsight].icon}
                  </span>
                  <div className="insight-meta">
                    <h4>{insights[currentInsight].title}</h4>
                    <div className="confidence-bar">
                      <motion.div 
                        className="confidence-fill"
                        style={{ backgroundColor: getInsightColor(insights[currentInsight].type) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${insights[currentInsight].confidence}%` }}
                        transition={{ delay: 0.3, duration: 1 }}
                      />
                      <span className="confidence-text">
                        {insights[currentInsight].confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <span className="trend-icon">
                    {getTrendIcon(insights[currentInsight].trend)}
                  </span>
                </div>
                <p className="insight-message">
                  {insights[currentInsight].message}
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        // Expanded view - all insights
        <div className="insights-expanded">
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="insights-title"
          >
            AI Financial Analysis
          </motion.h3>
          
          <div className="insights-grid">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                className={`insight-card full ${insight.type}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="insight-header">
                  <span className="insight-icon large">
                    {insight.icon}
                  </span>
                  <div className="insight-meta">
                    <h4>{insight.title}</h4>
                    <div className="confidence-bar">
                      <motion.div 
                        className="confidence-fill"
                        style={{ backgroundColor: getInsightColor(insight.type) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${insight.confidence}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      />
                      <span className="confidence-text">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <span className="trend-icon">
                    {getTrendIcon(insight.trend)}
                  </span>
                </div>
                
                <p className="insight-message">
                  {insight.message}
                </p>
                
                <div className="insight-action">
                  <strong>Recommendation:</strong> {insight.action}
                </div>
                
                {insight.potential && (
                  <div className="insight-potential">
                    <span className="potential-label">Potential Impact:</span>
                    <span className="potential-value">{insight.potential}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* AI Confidence Score */}
          <motion.div 
            className="ai-confidence-summary"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <h4>Overall Analysis Confidence</h4>
            <div className="confidence-circle">
              <motion.svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#4ECDC4"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - 0.89) }}
                  transition={{ delay: 1.2, duration: 2, ease: "easeOut" }}
                  transform="rotate(-90 60 60)"
                />
              </motion.svg>
              <div className="confidence-percentage">89%</div>
            </div>
            <p>High confidence in financial recommendations</p>
          </motion.div>
        </div>
      )}

      {/* Navigation dots for compact view */}
      {!expanded && insights.length > 0 && (
        <div className="insight-navigation">
          {insights.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === currentInsight ? 'active' : ''}`}
              onClick={() => setCurrentInsight(index)}
              style={{
                backgroundColor: index === currentInsight 
                  ? getInsightColor(insights[index].type) 
                  : 'rgba(255,255,255,0.3)'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AIInsights; 