import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import "./StatsDashboard.css";
import api from "../../api"

const StatsDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartRefs = {
    contribution: useRef(null),
    expense: useRef(null),
    necessity: useRef(null)
  };

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

  const contributionData = [
    { month: 'Jan 24', amount: 2350 },
    { month: 'Feb 24', amount: 2800 },
    { month: 'Mar 24', amount: 3200 },
    { month: 'Apr 24', amount: 2900 },
    { month: 'May 24', amount: 3400 },
    { month: 'Jun 24', amount: 3100 }
  ];

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/api/expenses/stats/');
      setStatsData(data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!statsData) return;

    const charts = {};
    
    // Contribution chart remains the same as it uses static data
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

    // Expense chart using API data
    charts.expense = new Chart(chartRefs.expense.current, {
      type: 'polarArea',
      data: {
        labels: statsData.category_breakdown.map(d => d.category
          .replace('_', ' ')
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')),
        datasets: [{
          data: statsData.category_breakdown.map(d => d.total),
          backgroundColor: COLORS.chartGradient.slice(0, statsData.category_breakdown.length)
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

    // Necessity chart using API data
    charts.necessity = new Chart(chartRefs.necessity.current, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Expenses by Necessity',
          data: statsData.necessity_breakdown.map(item => ({
            x: item.necessity_level,
            y: item.total
          })),
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
                const point = context.raw;
                return [
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
  }, [statsData]);

  if (loading) {
    return <div className="dashboard">Loading...</div>;
  }

  if (error) {
    return <div className="dashboard">Error: {error}</div>;
  }

  const performanceData = {
    current_month: statsData.current_month_total,
    last_month: statsData.last_month_total,
    month_change: statsData.month_over_month_change
  };

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