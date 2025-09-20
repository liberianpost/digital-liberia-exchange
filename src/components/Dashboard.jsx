import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ userData, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [profileData, setProfileData] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [cryptoList, setCryptoList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1D');

  // Fetch live cryptocurrency data
  useEffect(() => {
    fetchLiveCryptoData();
    fetchUserProfile();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchLiveCryptoData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveCryptoData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h'
      );
      
      if (response.ok) {
        const data = await response.json();
        setCryptoList(data);
      }
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      if (!userData?.dssn) return;
      
      const response = await fetch(
        `https://libpayapp.liberianpost.com:8081/profile-by-dssn?dssn=${userData.dssn}`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfileData(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const filteredCryptos = cryptoList.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCandlestickChart = (crypto) => (
    <div className="chart-container">
      <div className="chart-header">
        <h3>{crypto.name} Price Chart</h3>
        <div className="timeframe-selector">
          {['1H', '1D', '1W', '1M', '3M', '1Y'].map(tf => (
            <button
              key={tf}
              className={timeframe === tf ? 'timeframe-btn active' : 'timeframe-btn'}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-placeholder">
        <div className="chart-message">
          <span className="chart-icon">📊</span>
          <p>Live candlestick chart would be displayed here</p>
          <small>Integration with TradingView or Chart.js would go here</small>
        </div>
      </div>
      <div className="chart-stats">
        <div className="chart-stat">
          <span>Open</span>
          <span>${crypto.current_price.toLocaleString()}</span>
        </div>
        <div className="chart-stat">
          <span>High</span>
          <span>${(crypto.current_price * 1.05).toLocaleString()}</span>
        </div>
        <div className="chart-stat">
          <span>Low</span>
          <span>${(crypto.current_price * 0.95).toLocaleString()}</span>
        </div>
        <div className="chart-stat">
          <span>Volume</span>
          <span>${crypto.total_volume.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Cryptocurrency Market</h2>
        <div className="refresh-btn" onClick={fetchLiveCryptoData}>
          ↻ Refresh
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading cryptocurrency data...</div>
      ) : (
        <>
          <div className="crypto-grid">
            {filteredCryptos.map(crypto => (
              <div 
                key={crypto.id} 
                className="crypto-card"
                onClick={() => setSelectedCrypto(crypto)}
              >
                <div className="crypto-header">
                  <img src={crypto.image} alt={crypto.name} className="crypto-icon" />
                  <div className="crypto-info">
                    <h3>{crypto.name}</h3>
                    <span className="crypto-symbol">{crypto.symbol.toUpperCase()}</span>
                  </div>
                  <span className="crypto-rank">#{crypto.market_cap_rank}</span>
                </div>
                <div className="crypto-price">
                  <span className="price">${crypto.current_price.toLocaleString()}</span>
                  <span className={`change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                    {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'} {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </div>
                <div className="crypto-market-cap">
                  Market Cap: ${crypto.market_cap.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {selectedCrypto && (
            <div className="crypto-modal">
              <div className="modal-content">
                <button className="modal-close" onClick={() => setSelectedCrypto(null)}>×</button>
                <div className="modal-header">
                  <img src={selectedCrypto.image} alt={selectedCrypto.name} className="modal-crypto-icon" />
                  <h2>{selectedCrypto.name} ({selectedCrypto.symbol.toUpperCase()})</h2>
                </div>
                
                {renderCandlestickChart(selectedCrypto)}
                
                <div className="crypto-details-grid">
                  <div className="detail-card">
                    <h4>Market Data</h4>
                    <div className="detail-row">
                      <span>Current Price:</span>
                      <span>${selectedCrypto.current_price.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span>24h Change:</span>
                      <span className={selectedCrypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
                        {selectedCrypto.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Market Cap:</span>
                      <span>${selectedCrypto.market_cap.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span>Volume (24h):</span>
                      <span>${selectedCrypto.total_volume.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="detail-card">
                    <h4>Supply Info</h4>
                    <div className="detail-row">
                      <span>Circulating Supply:</span>
                      <span>{selectedCrypto.circulating_supply?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span>Max Supply:</span>
                      <span>{selectedCrypto.max_supply?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span>Total Supply:</span>
                      <span>{selectedCrypto.total_supply?.toLocaleString() || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="detail-card">
                    <h4>Price History</h4>
                    <div className="detail-row">
                      <span>All-Time High:</span>
                      <span>${selectedCrypto.ath?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span>ATH Change:</span>
                      <span className={selectedCrypto.ath_change_percentage >= 0 ? 'positive' : 'negative'}>
                        {selectedCrypto.ath_change_percentage?.toFixed(2) || '0'}%
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>All-Time Low:</span>
                      <span>${selectedCrypto.atl?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span>ATL Change:</span>
                      <span className="positive">
                        {selectedCrypto.atl_change_percentage?.toFixed(2) || '0'}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="trade-btn primary">Buy {selectedCrypto.symbol.toUpperCase()}</button>
                  <button className="trade-btn secondary">Sell {selectedCrypto.symbol.toUpperCase()}</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderTrade = () => (
    <div className="tab-content">
      <h2>Trading Platform</h2>
      <div className="trade-grid">
        <div className="trade-card">
          <div className="trade-icon">💰</div>
          <h3>Buy Crypto</h3>
          <p>Purchase cryptocurrencies with Liberian Dollars</p>
          <button className="trade-btn primary">Start Buying</button>
        </div>
        <div className="trade-card">
          <div className="trade-icon">💸</div>
          <h3>Sell Crypto</h3>
          <p>Sell your cryptocurrencies for Liberian Dollars</p>
          <button className="trade-btn secondary">Start Selling</button>
        </div>
        <div className="trade-card">
          <div className="trade-icon">📥</div>
          <h3>Deposit Funds</h3>
          <p>Add funds to your account</p>
          <button className="trade-btn outline">Deposit</button>
        </div>
        <div className="trade-card">
          <div className="trade-icon">📤</div>
          <h3>Withdraw Funds</h3>
          <p>Withdraw funds to your bank account</p>
          <button className="trade-btn outline">Withdraw</button>
        </div>
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Market Overview</h2>
        <div className="market-search">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading market data...</div>
      ) : (
        <div className="market-table-container">
          <table className="market-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>24h Change</th>
                <th>Market Cap</th>
                <th>Volume (24h)</th>
              </tr>
            </thead>
            <tbody>
              {filteredCryptos.map(crypto => (
                <tr key={crypto.id} onClick={() => setSelectedCrypto(crypto)}>
                  <td>{crypto.market_cap_rank}</td>
                  <td>
                    <div className="crypto-name-cell">
                      <img src={crypto.image} alt={crypto.name} className="table-crypto-icon" />
                      <div>
                        <div className="crypto-name">{crypto.name}</div>
                        <div className="crypto-symbol">{crypto.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td>${crypto.current_price.toLocaleString()}</td>
                  <td className={crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td>${crypto.market_cap.toLocaleString()}</td>
                  <td>${crypto.total_volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderWallet = () => (
    <div className="tab-content">
      <h2>Wallet</h2>
      <div className="wallet-grid">
        <div className="wallet-card">
          <div className="wallet-icon">💼</div>
          <h3>My Wallet</h3>
          <p>Manage your cryptocurrency holdings</p>
          <div className="wallet-balance">
            <span className="balance-label">Total Balance</span>
            <span className="balance-amount">$0.00</span>
          </div>
          <div className="wallet-actions">
            <button className="wallet-btn primary">Receive</button>
            <button className="wallet-btn secondary">Send</button>
          </div>
        </div>
        
        <div className="wallet-assets">
          <h3>My Assets</h3>
          <div className="assets-list">
            <div className="asset-item">
              <div className="asset-info">
                <span className="asset-icon">₿</span>
                <div className="asset-details">
                  <span className="asset-name">Bitcoin</span>
                  <span className="asset-symbol">BTC</span>
                </div>
              </div>
              <div className="asset-balance">
                <span className="asset-amount">0.000000</span>
                <span className="asset-value">$0.00</span>
              </div>
            </div>
            
            <div className="asset-item">
              <div className="asset-info">
                <span className="asset-icon">Ξ</span>
                <div className="asset-details">
                  <span className="asset-name">Ethereum</span>
                  <span className="asset-symbol">ETH</span>
                </div>
              </div>
              <div className="asset-balance">
                <span className="asset-amount">0.000000</span>
                <span className="asset-value">$0.00</span>
              </div>
            </div>
            
            <div className="asset-item">
              <div className="asset-info">
                <span className="asset-icon">●</span>
                <div className="asset-details">
                  <span className="asset-name">USDT</span>
                  <span className="asset-symbol">USDT</span>
                </div>
              </div>
              <div className="asset-balance">
                <span className="asset-amount">0.000000</span>
                <span className="asset-value">$0.00</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="wallet-transactions">
          <h3>Recent Transactions</h3>
          <div className="transactions-list">
            <div className="transaction-item">
              <div className="transaction-icon">📥</div>
              <div className="transaction-details">
                <span className="transaction-type">Deposit</span>
                <span className="transaction-date">No transactions yet</span>
              </div>
              <div className="transaction-amount">$0.00</div>
            </div>
            
            <div className="transaction-placeholder">
              <p>Your transaction history will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Profile Card in Upper Right Corner */}
      {profileData && (
        <div className="profile-floating-card">
          <div className="profile-card-content">
            <div className="profile-header">
              {profileData.image && (
                <img src={profileData.image} alt="Profile" className="profile-image" />
              )}
              <div className="profile-info">
                <h4>{profileData.first_name} {profileData.last_name}</h4>
                <p>{profileData.email}</p>
              </div>
            </div>
            <div className="profile-details">
              <div className="profile-detail">
                <span>DSSN:</span>
                <span>{profileData.DSSN || 'Not provided'}</span>
              </div>
              <div className="profile-detail">
                <span>Phone:</span>
                <span>{profileData.phone || 'Not provided'}</span>
              </div>
            </div>
            <button onClick={onLogout} className="logout-btn-sm">
              Logout
            </button>
          </div>
        </div>
      )}

      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="dashboard-logo">
              <span className="logo-icon">₿</span>
            </div>
            <h1>Digital Liberia Exchange</h1>
          </div>
          <div className="header-right">
            <div className="market-stats">
              <span className="market-stat">BTC: ${cryptoList[0]?.current_price.toLocaleString() || '0'}</span>
              <span className="market-stat">ETH: ${cryptoList[1]?.current_price.toLocaleString() || '0'}</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'home' ? 'nav-btn active' : 'nav-btn'} 
          onClick={() => setActiveTab('home')}
        >
          🏠 Home
        </button>
        <button 
          className={activeTab === 'trade' ? 'nav-btn active' : 'nav-btn'} 
          onClick={() => setActiveTab('trade')}
        >
          💰 Trade
        </button>
        <button 
          className={activeTab === 'market' ? 'nav-btn active' : 'nav-btn'} 
          onClick={() => setActiveTab('market')}
        >
          📈 Market
        </button>
        <button 
          className={activeTab === 'wallet' ? 'nav-btn active' : 'nav-btn'} 
          onClick={() => setActiveTab('wallet')}
        >
          💼 Wallet
        </button>
      </nav>

      <div className="dashboard-content">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'trade' && renderTrade()}
        {activeTab === 'market' && renderMarket()}
        {activeTab === 'wallet' && renderWallet()}
      </div>
    </div>
  );
}

export default Dashboard;
