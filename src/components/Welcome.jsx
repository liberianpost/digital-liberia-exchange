import '../index.css'

function Welcome() {
  return (
    <div className="welcome">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src="/react.svg" className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Digital Liberia Exchange</h1>
      <p>Welcome to your new React app with Vite!</p>
      <p className="info">
        We'll build upon this foundation to create your Firebase web application.
      </p>
    </div>
  )
}

export default Welcome
