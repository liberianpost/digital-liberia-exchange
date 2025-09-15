import '../index.css'

function Welcome({ onNavigateToLogin }) {
  return (
    <div className="welcome-container">
      {/* Animated background */}
      <div className="animated-background">
        <div className="floating-coins">
          <div className="coin bitcoin">₿</div>
          <div className="coin ethereum">Ξ</div>
          <div className="coin litecoin">Ł</div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="welcome-content">
        <div className="logo-container">
          <div className="main-logo">
            <span className="logo-icon">₿</span>
          </div>
          <div className="logo-glow"></div>
        </div>
        
        <h1 className="welcome-title">
          <span className="title-gradient">Digital Liberia</span>
          <span className="title-accent">Exchange</span>
        </h1>
        
        <p className="welcome-subtitle">
          Liberate Your Financial Future with Secure Crypto Trading
        </p>
        
        <p className="welcome-description">
          Experience the next generation of cryptocurrency exchange where security meets simplicity. 
          Trade Bitcoin, Ethereum, and other digital assets with lightning-fast execution and 
          industry-leading protection. Join the financial revolution today.
        </p>
        
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Instant trade execution with minimal fees</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Bank-Level Security</h3>
            <p>Military-grade encryption protects your assets</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🌍</div>
            <h3>Global Access</h3>
            <p>Trade anywhere, anytime with our platform</p>
          </div>
        </div>
        
        <button className="login-button" onClick={onNavigateToLogin}>
          <span className="button-text">Launch Exchange</span>
          <span className="button-icon">→</span>
        </button>
        
        <div className="grass-reflection">
          <div className="grass"></div>
          <div className="reflection"></div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
