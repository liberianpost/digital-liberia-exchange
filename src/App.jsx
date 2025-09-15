import { useState } from 'react'
import Welcome from './components/Welcome'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './index.css'

function App() {
  const [currentView, setCurrentView] = useState('welcome')
  const [userData, setUserData] = useState(null)

  const navigateToLogin = () => {
    setCurrentView('login')
  }

  const navigateToDashboard = (userData) => {
    setUserData(userData)
    setCurrentView('dashboard')
  }

  const navigateToWelcome = () => {
    setCurrentView('welcome')
    setUserData(null)
  }

  return (
    <div className="app">
      {currentView === 'welcome' ? (
        <Welcome onNavigateToLogin={navigateToLogin} />
      ) : currentView === 'login' ? (
        <Login onLoginSuccess={navigateToDashboard} onBack={navigateToWelcome} />
      ) : (
        <Dashboard userData={userData} onLogout={navigateToWelcome} />
      )}
    </div>
  )
}

export default App
