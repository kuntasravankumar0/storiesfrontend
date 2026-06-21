import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img 
            src="https://dev-maheshstores.pantheonsite.io/wp-content/uploads/2026/06/WhatsApp-Image-2026-06-20-at-7.21.53-PM.jpeg" 
            alt="Ink & Dreams" 
            className="logo-img"
          />
          <span className="logo-text">Ink & Dreams</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/stories" onClick={() => setMenuOpen(false)}>Stories</Link>
          <Link to="/audio-stories" onClick={() => setMenuOpen(false)}>Audio Stories</Link>
          <Link to="/quotes" onClick={() => setMenuOpen(false)}>Quotes</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          
          {isAuthenticated() && (
            <Link to="/my-library" onClick={() => setMenuOpen(false)} className="library-link">My Library</Link>
          )}

          {isAuthenticated() && !isAdmin() && (
            <Link to="/create-story" onClick={() => setMenuOpen(false)} className="create-link">Create Story</Link>
          )}

          {isAuthenticated() && isAdmin() && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="admin-link">
              <FiSettings /> Admin
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          <motion.button 
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </motion.button>

          {isAuthenticated() ? (
            <div className="user-menu">
              <Link to="/profile" className="user-avatar">
                <FiUser />
                <span>{user?.username}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <FiLogOut />
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">Sign In</Link>
          )}

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
