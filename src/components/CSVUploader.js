import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import './CSVUploader.css';

const CSVUploader = ({ onDataParsed, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  // CSV parsing function
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV must have at least a header and one data row');

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    return { headers, rows };
  };

  // Categorize transactions automatically
  const categorizeTransaction = (description) => {
    const desc = description.toLowerCase();
    
    if (desc.includes('grocery') || desc.includes('food') || desc.includes('restaurant') || 
        desc.includes('cafe') || desc.includes('pizza') || desc.includes('mcdonald')) {
      return { category: 'Food', color: '#FF6B6B' };
    }
    if (desc.includes('gas') || desc.includes('uber') || desc.includes('taxi') || 
        desc.includes('bus') || desc.includes('metro') || desc.includes('parking')) {
      return { category: 'Transport', color: '#4ECDC4' };
    }
    if (desc.includes('movie') || desc.includes('netflix') || desc.includes('spotify') || 
        desc.includes('game') || desc.includes('entertainment')) {
      return { category: 'Entertainment', color: '#45B7D1' };
    }
    if (desc.includes('amazon') || desc.includes('shopping') || desc.includes('store') || 
        desc.includes('mall') || desc.includes('retail')) {
      return { category: 'Shopping', color: '#96CEB4' };
    }
    if (desc.includes('electric') || desc.includes('water') || desc.includes('internet') || 
        desc.includes('phone') || desc.includes('rent') || desc.includes('insurance')) {
      return { category: 'Bills', color: '#FFEAA7' };
    }
    
    return { category: 'Other', color: '#DDA0DD' };
  };

  // Process the parsed CSV data
  const processFinancialData = (rows) => {
    const transactions = [];
    const categories = {};
    let totalIncome = 0;
    let totalExpenses = 0;

    rows.forEach(row => {
      // Try to find amount column (common variations)
      const amountKeys = ['amount', 'debit', 'credit', 'transaction amount', 'value'];
      const descKeys = ['description', 'memo', 'payee', 'transaction description'];
      
      let amount = 0;
      let description = '';

      // Find amount
      for (const key of amountKeys) {
        if (row[key] && !isNaN(parseFloat(row[key]))) {
          amount = parseFloat(row[key]);
          break;
        }
      }

      // Find description
      for (const key of descKeys) {
        if (row[key]) {
          description = row[key];
          break;
        }
      }

      if (amount !== 0 && description) {
        const { category, color } = categorizeTransaction(description);
        
        if (amount > 0) {
          totalIncome += amount;
        } else {
          totalExpenses += Math.abs(amount);
          
          // Add to categories
          if (!categories[category]) {
            categories[category] = { name: category, amount: 0, color };
          }
          categories[category].amount += Math.abs(amount);
        }

        transactions.push({
          description,
          amount,
          category,
          date: row.date || row['transaction date'] || new Date().toISOString().split('T')[0]
        });
      }
    });

    // Convert categories to array and calculate percentages
    const categoryArray = Object.values(categories);
    categoryArray.forEach(cat => {
      cat.percentage = Math.round((cat.amount / totalExpenses) * 100);
    });

    // Sort by amount (largest first)
    categoryArray.sort((a, b) => b.amount - a.amount);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.max(0, balance / totalIncome) : 0;

    return {
      balance: balance,
      monthlyIncome: totalIncome,
      monthlyExpenses: totalExpenses,
      savingsRate: savingsRate,
      categories: categoryArray,
      transactions: transactions
    };
  };

  const handleFile = useCallback(async (selectedFile) => {
    setParseError(null);
    setFile(selectedFile);

    try {
      const text = await selectedFile.text();
      const { rows } = parseCSV(text);
      
      // Show preview of first few rows
      setPreviewData(rows.slice(0, 3));
      
    } catch (error) {
      setParseError(`Error parsing CSV: ${error.message}`);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleProcessData = async () => {
    if (!file) return;

    try {
      const text = await file.text();
      const { rows } = parseCSV(text);
      const processedData = processFinancialData(rows);
      onDataParsed(processedData);
    } catch (error) {
      setParseError(`Error processing data: ${error.message}`);
    }
  };

  return (
    <div className="csv-uploader">
      {/* Upload Area */}
      <motion.div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="file-input"
          id="csv-file"
        />
        
        {!file ? (
          <label htmlFor="csv-file" className="upload-content">
            <motion.div 
              className="upload-icon"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📁
            </motion.div>
            <h4>Drop your CSV file here</h4>
            <p>or click to browse</p>
            <div className="supported-formats">
              <span>Supports: Bank statements, Mint exports, YNAB exports</span>
            </div>
          </label>
        ) : (
          <div className="file-info">
            <div className="file-icon">✅</div>
            <div className="file-details">
              <h4>{file.name}</h4>
              <p>{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button 
              className="remove-file"
              onClick={() => {
                setFile(null);
                setPreviewData(null);
                setParseError(null);
              }}
            >
              ✕
            </button>
          </div>
        )}
      </motion.div>

      {/* Error Display */}
      {parseError && (
        <motion.div 
          className="error-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="error-icon">⚠️</span>
          {parseError}
        </motion.div>
      )}

      {/* Preview Data */}
      {previewData && !parseError && (
        <motion.div 
          className="preview-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4>Preview (First 3 rows)</h4>
          <div className="preview-table">
            {previewData.map((row, index) => (
              <div key={index} className="preview-row">
                <span className="row-number">{index + 1}</span>
                <div className="row-data">
                  {Object.entries(row).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="data-item">
                      <strong>{key}:</strong> {value}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <motion.button
            className="process-button"
            onClick={handleProcessData}
            disabled={isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isProcessing ? 'Processing...' : 'Process Data'}
          </motion.button>
        </motion.div>
      )}

      {/* Help Section */}
      <div className="help-section">
        <h4>💡 Tips for best results:</h4>
        <ul>
          <li>Export CSV from your bank or budgeting app</li>
          <li>Include columns for: Date, Description, Amount</li>
          <li>Transactions will be automatically categorized</li>
          <li>Positive amounts = income, Negative = expenses</li>
        </ul>
      </div>
    </div>
  );
};

export default CSVUploader; 