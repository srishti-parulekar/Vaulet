import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h1 className="logo">Vaulet</h1>
        <nav className="menu">
          <ul>
            <li>Dashboard</li>
            <li>Payment</li>
            <li>Transaction</li>
            <li>Bill & Tax</li>
            <li>Notifications</li>
            <li>Account</li>
            <li>My Card</li>
            <li>Settings</li>
            <li>Call Center</li>
            <li>Help</li>
            <li>Log Out</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <h2>Welcome back, Olivia Wilson</h2>
          <p>Let's take a detailed look at your financial situation today.</p>
          <input type="search" placeholder="Search here" />
        </header>

        <div className="account-balance-container">
          <section className="account-balance">
            <h3>My Account & Balance</h3>
            <div className="balance-card">
              <h4>Total Balance</h4>
              <p>$5,254.50</p>
              <p>123-456-7890 | April 2028</p>
            </div>
            <div className="account-balance">
              <p>Priority Customer</p>
              <p>Olivia Wilson</p>
              <p>Activated</p>
            </div>
            <button>History</button>
            <button>Top-up</button>
          </section>

          <section className="transaction-history">
            <h3>Transaction</h3>
            <table>
              <thead>
                <tr>
                  <th>Purpose</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fauget Cafe</td>
                  <td>Today</td>
                  <td>$500</td>
                  <td>Done</td>
                </tr>
                <tr>
                  <td>Claudia Store</td>
                  <td>Today</td>
                  <td>$1000</td>
                  <td>Done</td>
                </tr>
                <tr>
                  <td>Chidi Barber</td>
                  <td>Today</td>
                  <td>$500</td>
                  <td>Done</td>
                </tr>
                <tr>
                  <td>Cahaya Dewi</td>
                  <td>Today</td>
                  <td>$1000</td>
                  <td>Pending</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
