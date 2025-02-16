import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import "./StatsDashboard.css"
const StatsDashboard = () => {
  // Data definitions remain the same
  const performanceData = {
    total_contributions: 15750.50,
    monthly_contributions: 2430.75,
    weekly_contributions: 575.25
  };

  const contributionData = [
    { month: 'Jan 24', amount: 2350 },
    { month: 'Feb 24', amount: 2800 },
    { month: 'Mar 24', amount: 3200 },
    { month: 'Apr 24', amount: 2900 },
    { month: 'May 24', amount: 3400 },
    { month: 'Jun 24', amount: 3100 }
  ];

  const expenseData = [
    { category: 'Food & Dining', amount: 850.50, necessity_level: 4 },
    { category: 'Transportation', amount: 450.75, necessity_level: 3 },
    { category: 'Utilities', amount: 320.25, necessity_level: 4 },
    { category: 'Shopping', amount: 675.00, necessity_level: 2 },
    { category: 'Entertainment', amount: 250.00, necessity_level: 1 },
    { category: 'Healthcare', amount: 425.75, necessity_level: 4 },
    { category: 'Education', amount: 550.00, necessity_level: 3 }
  ];

  const chartRefs = {
    contribution: useRef(null),
    expense: useRef(null),
    necessity: useRef(null)
  };

  const scatterData = expenseData.map(item => ({
    x: item.necessity_level,
    y: item.amount,
    label: item.category
  }));

  const COLORS = {
    primary: 'rgba(76, 175, 80, 0.9)',
    secondary: 'rgba(76, 175, 80, 0.2)',
    chartGradient: [
      'rgba(76, 175, 80, 0.9)',
      'rgba(69, 160, 73, 0.9)',
      'rgba(53, 122, 56, 0.9)',
      'rgba(42, 95, 43, 0.9)',
      'rgba(30, 68, 31, 0.9)',
      'rgba(19, 44, 19, 0.9)',
      'rgba(9, 21, 9, 0.9)'
    ]
  };

  useEffect(() => {
    // Chart initialization code remains the same
    const charts = {};
    
    charts.contribution = new Chart(chartRefs.contribution.current, {
      type: 'line',
      data: {
        labels: contributionData.map(d => d.month),
        datasets: [{
          label: 'Monthly Contributions',
          data: contributionData.map(d => d.amount),
          borderColor: COLORS.primary,
          backgroundColor: COLORS.secondary,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: COLORS.primary
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: 'white', padding: 20 }
          },
          title: {
            display: true,
            text: 'Contribution Trends',
            color: 'white',
            padding: 20
          }
        },
        scales: {
          y: {
            ticks: { 
              color: 'white',
              callback: value => `$${value.toLocaleString()}`
            },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          x: {
            ticks: { color: 'white' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });

    charts.expense = new Chart(chartRefs.expense.current, {
      type: 'polarArea',
      data: {
        labels: expenseData.map(d => d.category),
        datasets: [{
          data: expenseData.map(d => d.amount),
          backgroundColor: COLORS.chartGradient
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { 
              color: 'white',
              padding: 20,
              font: { size: 11 }
            }
          },
          title: {
            display: true,
            text: 'Expenses by Category',
            color: 'white',
            padding: 20
          }
        }
      }
    });

    charts.necessity = new Chart(chartRefs.necessity.current, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Expenses by Necessity',
          data: scatterData,
          backgroundColor: COLORS.primary,
          pointRadius: 10,
          pointHoverRadius: 15,
          borderColor: 'white',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: 'white', padding: 20 }
          },
          title: {
            display: true,
            text: 'Expense Necessity Analysis',
            color: 'white',
            padding: 20
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const point = scatterData[context.dataIndex];
                return [
                  `${point.label}`,
                  `Amount: $${point.y.toLocaleString()}`,
                  `Level: ${['Low', 'Medium', 'High', 'Essential'][point.x - 1]}`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Amount ($)',
              color: 'white'
            },
            ticks: { 
              color: 'white',
              callback: value => `$${value.toLocaleString()}`
            },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          x: {
            title: {
              display: true,
              text: 'Necessity Level',
              color: 'white'
            },
            ticks: { 
              color: 'white',
              stepSize: 1,
              callback: value => ['Low', 'Medium', 'High', 'Essential'][value - 1] || value
            },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            min: 0.5,
            max: 4.5
          }
        }
      }
    });

    return () => {
      Object.values(charts).forEach(chart => chart.destroy());
    };
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Financial Dashboard</h1>
        
        <div className="stats-grid">
          {Object.entries(performanceData).map(([key, value]) => (
            <div key={key} className="stats-card">
              <h3 className="stats-card-title">
                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </h3>
              <p className="stats-card-value">
                ${value.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          <div className="chart-container">
            <div className="chart-wrapper">
              <canvas ref={chartRefs.contribution}></canvas>
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-wrapper">
              <canvas ref={chartRefs.expense}></canvas>
            </div>
          </div>

          <div className="chart-container full-width">
            <div className="chart-wrapper">
              <canvas ref={chartRefs.necessity}></canvas>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default StatsDashboard;