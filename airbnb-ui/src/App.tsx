import { useState } from 'react'
import { AiOutlineHeart } from 'react-icons/ai'
import { BiUserPlus } from 'react-icons/bi'
import { BsMoon } from 'react-icons/bs'
import { IoAddOutline, IoMenuOutline, IoCloseOutline } from 'react-icons/io5'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-logo">List</span>
        <span className="brand-highlight">On</span>
      </div>

      <nav className={`site-nav${menuOpen ? ' open' : ''}`}>
        <a href="#" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="#" onClick={() => setMenuOpen(false)}>Dashboard</a>
        <a href="#" onClick={() => setMenuOpen(false)}>Listing</a>
        <a href="#" onClick={() => setMenuOpen(false)}>Explore</a>
      </nav>

      <div className="top-actions">
        <button type="button" className="icon-button" aria-label="Favorites">
          <AiOutlineHeart size={18} />
          <span className="badge">0</span>
        </button>
        <button type="button" className="icon-button" aria-label="User invite">
          <BiUserPlus size={18} />
        </button>
        <button type="button" className="icon-button" aria-label="Toggle theme">
          <BsMoon size={18} />
        </button>
        <button type="button" className="action-button">
          <IoAddOutline size={16} />
          <span>Add Listing</span>
        </button>
      </div>

      <button
        type="button"
        className="menu-toggle"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(o => !o)}
      >
        {menuOpen ? <IoCloseOutline size={20} /> : <IoMenuOutline size={20} />}
      </button>
    </header>
  )
}

export default App
