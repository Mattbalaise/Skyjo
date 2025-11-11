import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home-page">
      <div className="home-content">
        <h1 className="skyjo-title">Skyjo</h1>
        <Link to="/jouer" className="play-button">
          Jouer
        </Link>
      </div>
    </div>
  )
}

export default Home

