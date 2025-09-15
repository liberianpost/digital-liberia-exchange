import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ userData, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [profileData, setProfileData] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [cryptoList, setCryptoList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample cryptocurrency data (replace with real API later)
  const sampleCryptos = [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      current_price: 51622,
      market_cap: 1012000000000,
      market_cap_rank: 1,
      price_change_percentage_24h: 1.25,
      ath: 69045,
      ath_change_percentage: -25.17,
      atl: 67.81,
      atl_change_percentage: 76075.51,
      max_supply: 21000000,
      total_supply: 21000000,
      circulating_supply: 19636875
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      current_price: 2987,
      market_cap: 359200000000,
      market_cap_rank: 2,
      price_change_percentage_24h: 2.15,
      ath: 4878,
      ath_change_percentage: -38.72,
      atl: 0.432979,
      atl_change_percentage: 689900.24,
      max_supply: null,
      total_supply: 120000000,
      circulating_supply: 120000000
    },
    {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
      current_price: 0.58,
      market_cap: 20600000000,
      market_cap_rank: 8,
      price_change_percentage_24h: -0.75,
      ath: 3.09,
      ath_change_percentage: -81.17,
      atl: 0.01925275,
      atl_change_percentage: 2913.03,
      max_supply: 45000000000,
      total_supply: 45000000000,
      circulating_supply: 35500000000
    }
  ];

  useEffect(() => {
    setCryptoList(sampleCryptos);
    // Fetch user profile when dashboard loads
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Replace with actual user email from your auth system
      const userEmail = 'user@example.com'; 
      const response = await fetch(`https://libpayapp.liberianpost.com:8081/profile?email=${userEmail}`, {
        credentials: 'include'
      });
      
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

  const renderHome = () => (
    <div className="tab-content">
      <h2>Cryptocurrency Market</h2>
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
                {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'} {Math.abs(crypto.price_change_percentage_24h)}%
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
            <h2>{selectedCrypto.name} ({selectedCrypto.symbol.toUpperCase()})</h2>
            <div className="crypto-details">
              <div className="detail-row">
                <span>Current Price:</span>
                <span>${selectedCrypto.current_price.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span>Market Cap Rank:</span>
                <span>#{selectedCrypto.market_cap_rank}</span>
              </div>
              <div className="detail-row">
                <span>Market Cap:</span>
                <span>${selectedCrypto.market_cap.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span>24h Change:</span>
                <span className={selectedCrypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
                  {selectedCrypto.price_change_percentage_24h}%
                </span>
              </div>
              <div className="detail-row">
                <span>All-Time High:</span>
                <span>${selectedCrypto.ath.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span>All-Time Low:</span>
                <span>${selectedCrypto.atl.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span>Max Supply:</span>
                <span>{selectedCrypto.max_supply ? selectedCrypto.max_supply.toLocaleString() : 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span>Circulating Supply:</span>
                <span>{selectedCrypto.circulating_supply.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="tab-content">
      <h2>User Profile</h2>
      {profileData ? (
        <div className="profile-card">
          <div className="profile-header">
            {profileData.image && (
              <img src={profileData.image} alt="Profile" className="profile-image" />
            )}
            <h3>{profileData.first_name} {profileData.last_name}</h3>
          </div>
          <div className="profile-details">
            <div className="detail-item">
              <span className="label">Email:</span>
              <span className="value">{profileData.email}</span>
            </div>
            <div className="detail-item">
              <span className="label">Phone:</span>
              <span className="value">{profileData.phone || 'Not provided'}</span>
            </div>
            <div className="detail-item">
              <span className="label">DSSN:</span>
              <span className="value">{profileData.DSSN || 'Not provided'}</span>
            </div>
            <div className="detail-item">
              <span className="label">User ID:</span>
              <span className="value">{profileData.user_id}</span>
            </div>
            <div className="detail-item">
              <span className="label">Address:</span>
              <span className="value">{profileData.address || 'Not provided'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Postal Address:</span>
              <span className="value">{profileData.postal_address || 'Not provided'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="loading">Loading profile...</div>
      )}
    </div>
  );

  const renderTrade = () => (
    <div className="tab-content">
      <h2>Trading Platform</h2>
      <div className="trade-grid">
        <div className="trade-card">
          <h3>Buy Crypto</h3>
          <p>Purchase cryptocurrencies with Liberian Dollars</p>
          <button className="trade-btn primary">Start Buying</button>
        </div>
        <div className="trade-card">
          <h3>Sell Crypto</h3>
          <p>Sell your cryptocurrencies for Liberian Dollars</p>
          <button className="trade-btn secondary">Start Selling</button>
        </div>
        <div className="trade-card">
          <h3>Deposit Funds</h3>
          <p>Add funds to your account</p>
          <button className="trade-btn outline">Deposit</button>
        </div>
        <div className="trade-card">
          <h3>Withdraw Funds</h3>
          <p>Withdraw funds to your bank account</p>
          <button className="trade-btn outline">Withdraw</button>
        </div>
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="tab-content">
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
      <div className="market-table-container">
        <table className="market-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>24h Change</th>
              <th>Market Cap</th>
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
                  {crypto.price_change_percentage_24h}%
                </td>
                <td>${crypto.market_cap.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="dashboard-logo">
            <span className="logo-icon">₿</span>
          </div>
          <h1>Digital Liberia Exchange</h1>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'home' ? 'nav-btn active' : 'nav-btn'} 
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button 
          className={activeTab === 'trade' ? 'nav-btn active' : 'nav-btn'} 
          onClick={() => setActiveTab('trade')}
        >
          Trade
        </button>
        <button 
          className={activeTab === 'market' ? 'nav-btn active' : 'nav-btn'} 
          onClick={() => setActiveTab('market')}
        >
          Market
        </button>
        <button 
          className={activeTab === 'profile' ? 'nav-btn active' : 'nav-btn'} 
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </nav>

      <div className="dashboard-content">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'trade' && renderTrade()}
        {activeTab === 'market' && renderMarket()}
      </div>
    </div>
  );
}

export default Dashboard;
