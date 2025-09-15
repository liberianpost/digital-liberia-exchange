import { useState } from 'react'
import Welcome from './components/Welcome'
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <Welcome />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
