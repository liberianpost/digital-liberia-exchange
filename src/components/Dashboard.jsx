import '../index.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-logo">
          <span className="logo-icon">₿</span>
        </div>
        <h1>Digital Liberia Exchange Dashboard</h1>
        <p>Welcome to your trading dashboard</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Portfolio Overview</h2>
          <div className="portfolio-stats">
            <div className="stat">
              <span className="stat-label">Total Balance</span>
              <span className="stat-value">$0.00</span>
            </div>
            <div className="stat">
              <span className="stat-label">Available</span>
              <span className="stat-value">$0.00</span>
            </div>
            <div className="stat">
              <span className="stat-label">In Orders</span>
              <span className="stat-value">$0.00</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn primary">Buy Crypto</button>
            <button className="action-btn secondary">Sell Crypto</button>
            <button className="action-btn outline">Deposit</button>
            <button className="action-btn outline">Withdraw</button>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-type">Login</span>
              <span className="activity-time">Just now</span>
              <span className="activity-status success">Successful</span>
            </div>
            <div className="activity-item">
              <span className="activity-type">Account</span>
              <span className="activity-time">Today</span>
              <span className="activity-status">Verified</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Market Overview</h2>
          <div className="market-list">
            <div className="market-item">
              <span className="crypto-name">Bitcoin (BTC)</span>
              <span className="crypto-price">$0.00</span>
              <span className="crypto-change">+0.00%</span>
            </div>
            <div className="market-item">
              <span className="crypto-name">Ethereum (ETH)</span>
              <span className="crypto-price">$0.00</span>
              <span className="crypto-change">+0.00%</span>
            </div>
            <div className="market-item">
              <span className="crypto-name">Litecoin (LTC)</span>
              <span className="crypto-price">$0.00</span>
              <span className="crypto-change">+0.00%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-footer">
        <p>Digital Liberia Exchange • Secure Crypto Trading</p>
      </div>
    </div>
  );
}

export default Dashboard;
