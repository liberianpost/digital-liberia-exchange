import { useState } from 'react'
import Welcome from './components/Welcome'
import Login from './components/Login'
import './index.css'

function App() {
  const [currentView, setCurrentView] = useState('welcome')

  const navigateToLogin = () => {
    setCurrentView('login')
  }

  return (
    <div className="app">
      {currentView === 'welcome' ? (
        <Welcome onNavigateToLogin={navigateToLogin} />
      ) : (
        <Login />
      )}
    </div>
  )
}

export default App
