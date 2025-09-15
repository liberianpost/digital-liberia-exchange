import '../index.css'

function Login() {
  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">₿</span>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to access your Digital Liberia Exchange account</p>
        </div>
        
        <div className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
            />
          </div>
          
          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#forgot" className="forgot-link">Forgot password?</a>
          </div>
          
          <button className="login-submit-btn">
            Sign In
          </button>
          
          <div className="login-divider">
            <span>Or continue with</span>
          </div>
          
          <div className="social-login">
            <button className="social-btn google">
              <span className="social-icon">G</span>
              Google
            </button>
            <button className="social-btn github">
              <span className="social-icon">⚡</span>
              WalletConnect
            </button>
          </div>
          
          <div className="login-footer">
            <p>Don't have an account? <a href="#signup" className="signup-link">Sign up</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
