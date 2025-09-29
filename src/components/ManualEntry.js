import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './ManualEntry.css';

const ManualEntry = ({ onDataSubmit, isProcessing }) => {
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    currentBalance: '',
    categories: [
      { name: 'Food', amount: '', color: '#FF6B6B' },
      { name: 'Transport', amount: '', color: '#4ECDC4' },
      { name: 'Entertainment', amount: '', color: '#45B7D1' },
      { name: 'Shopping', amount: '', color: '#96CEB4' },
      { name: 'Bills', amount: '', color: '#FFEAA7' },
      { name: 'Other', amount: '', color: '#DDA0DD' }
    ]
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleCategoryChange = (index, value) => {
    const newCategories = [...formData.categories];
    newCategories[index].amount = value;
    setFormData(prev => ({
      ...prev,
      categories: newCategories
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate income
    if (!formData.monthlyIncome || isNaN(formData.monthlyIncome) || parseFloat(formData.monthlyIncome) <= 0) {
      newErrors.monthlyIncome = 'Please enter a valid monthly income';
    }

    // Validate balance
    if (!formData.currentBalance || isNaN(formData.currentBalance)) {
      newErrors.currentBalance = 'Please enter a valid current balance';
    }

    // Validate at least one category has an amount
    const hasValidCategory = formData.categories.some(cat => 
      cat.amount && !isNaN(cat.amount) && parseFloat(cat.amount) > 0
    );

    if (!hasValidCategory) {
      newErrors.categories = 'Please enter at least one expense category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Process the data
    const income = parseFloat(formData.monthlyIncome);
    const balance = parseFloat(formData.currentBalance);
    
    // Filter and process categories
    const validCategories = formData.categories
      .filter(cat => cat.amount && !isNaN(cat.amount) && parseFloat(cat.amount) > 0)
      .map(cat => ({
        ...cat,
        amount: parseFloat(cat.amount)
      }));

    // Calculate totals
    const totalExpenses = validCategories.reduce((sum, cat) => sum + cat.amount, 0);
    
    // Calculate percentages
    validCategories.forEach(cat => {
      cat.percentage = Math.round((cat.amount / totalExpenses) * 100);
    });

    // Sort by amount
    validCategories.sort((a, b) => b.amount - a.amount);

    const savingsRate = income > 0 ? Math.max(0, (income - totalExpenses) / income) : 0;

    const processedData = {
      balance: balance,
      monthlyIncome: income,
      monthlyExpenses: totalExpenses,
      savingsRate: savingsRate,
      categories: validCategories
    };

    onDataSubmit(processedData);
  };

  return (
    <div className="manual-entry">
      <form onSubmit={handleSubmit} className="entry-form">
        {/* Income Section */}
        <motion.div 
          className="form-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h4>💰 Income & Balance</h4>
          
          <div className="form-group">
            <label htmlFor="monthlyIncome">Monthly Income</label>
            <input
              type="number"
              id="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
              placeholder="e.g., 3200"
              className={errors.monthlyIncome ? 'error' : ''}
            />
            {errors.monthlyIncome && (
              <span className="error-text">{errors.monthlyIncome}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="currentBalance">Current Balance</label>
            <input
              type="number"
              id="currentBalance"
              value={formData.currentBalance}
              onChange={(e) => handleInputChange('currentBalance', e.target.value)}
              placeholder="e.g., 4250"
              className={errors.currentBalance ? 'error' : ''}
            />
            {errors.currentBalance && (
              <span className="error-text">{errors.currentBalance}</span>
            )}
          </div>
        </motion.div>

        {/* Expenses Section */}
        <motion.div 
          className="form-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4>💸 Monthly Expenses</h4>
          <p className="section-description">Enter your average monthly spending for each category</p>
          
          {errors.categories && (
            <div className="error-text section-error">{errors.categories}</div>
          )}

          <div className="categories-grid">
            {formData.categories.map((category, index) => (
              <motion.div 
                key={category.name}
                className="category-input"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <div className="category-header">
                  <div 
                    className="category-color"
                    style={{ backgroundColor: category.color }}
                  />
                  <label>{category.name}</label>
                </div>
                <input
                  type="number"
                  value={category.amount}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Summary */}
        {formData.monthlyIncome && formData.categories.some(cat => cat.amount) && (
          <motion.div 
            className="form-section summary-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4>📊 Quick Summary</h4>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Monthly Income</span>
                <span className="summary-value">
                  ${parseFloat(formData.monthlyIncome || 0).toLocaleString()}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Expenses</span>
                <span className="summary-value">
                  ${formData.categories
                    .reduce((sum, cat) => sum + (parseFloat(cat.amount) || 0), 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Monthly Surplus</span>
                <span className={`summary-value ${
                  (parseFloat(formData.monthlyIncome || 0) - 
                   formData.categories.reduce((sum, cat) => sum + (parseFloat(cat.amount) || 0), 0)) >= 0 
                    ? 'positive' : 'negative'
                }`}>
                  ${(parseFloat(formData.monthlyIncome || 0) - 
                     formData.categories.reduce((sum, cat) => sum + (parseFloat(cat.amount) || 0), 0))
                     .toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="submit-button"
          disabled={isProcessing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isProcessing ? 'Creating Your Dashboard...' : 'Create My Financial Dashboard'}
        </motion.button>
      </form>

      {/* Tips Section */}
      <motion.div 
        className="tips-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h4>💡 Tips:</h4>
        <ul>
          <li>Use your average monthly amounts for more accurate insights</li>
          <li>Include all regular expenses, even small ones</li>
          <li>You can always update this data later</li>
          <li>Leave categories at $0 if they don't apply to you</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default ManualEntry; 