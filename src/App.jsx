import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Play from './pages/Play/Play'
import Design from './pages/Design/Design'
import Rules from './pages/Rules/Rules'
import './App.css'

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="logo">Skyjo</Link>
        <div className="nav-links">
          <Link to="/">Accueil</Link>
          <Link to="/a-propos">À propos</Link>
          <Link to="/jouer">Jouer</Link>
          <Link to="/design">Design</Link>
          <Link to="/regles">Règles</Link>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/jouer" element={<Play />} />
          <Route path="/design" element={<Design />} />
          <Route path="/regles" element={<Rules />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

