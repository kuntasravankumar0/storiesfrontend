import { motion } from 'framer-motion';
import { FiBookOpen, FiHeadphones, FiHeart, FiBookmark, FiSearch, FiMoon, FiUser, FiMessageCircle } from 'react-icons/fi';
import './StaticPages.css';

const Help = () => {
  return (
    <div className="static-page">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>❓ Help Center</h1>
          <p className="page-subtitle">Everything you need to know about using Ink & Dreams</p>
        </motion.div>

        <motion.div className="help-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="help-card">
            <div className="help-icon"><FiBookOpen /></div>
            <h3>Reading Stories</h3>
            <ul>
              <li>Browse stories from the <strong>Stories</strong> page.</li>
              <li>Use filters to find stories by genre, language, or reading time.</li>
              <li>Click on any story card to read the full story.</li>
              <li>Your reading progress is saved automatically.</li>
            </ul>
          </div>

          <div className="help-card">
            <div className="help-icon"><FiHeadphones /></div>
            <h3>Audio Stories</h3>
            <ul>
              <li>Go to <strong>Audio Stories</strong> to listen.</li>
              <li>Click the play button on any audio card.</li>
              <li>Use the bottom player bar to control playback.</li>
              <li>Download available stories for offline listening.</li>
            </ul>
          </div>

          <div className="help-card">
            <div className="help-icon"><FiHeart /></div>
            <h3>Love & Rate Stories</h3>
            <ul>
              <li>Click the <strong>❤️ Love</strong> button to show appreciation.</li>
              <li>Use the <strong>⭐ Star Rating</strong> (1-5) to rate stories.</li>
              <li>You must be logged in to love or rate.</li>
              <li>You can toggle love on/off by clicking again.</li>
            </ul>
          </div>

          <div className="help-card">
            <div className="help-icon"><FiBookmark /></div>
            <h3>Bookmarks & Saves</h3>
            <ul>
              <li>Click <strong>🔖 Save</strong> to bookmark a story for later.</li>
              <li>Access your saved stories from your profile.</li>
              <li>Click again to remove the bookmark.</li>
            </ul>
          </div>

          <div className="help-card">
            <div className="help-icon"><FiSearch /></div>
            <h3>Search & Filter</h3>
            <ul>
              <li>Use the search bar to find stories by title or author.</li>
              <li>Filter by genre: Love, Thriller, Mystery, Fantasy, etc.</li>
              <li>Filter by language: English, Telugu, Hindi.</li>
              <li>Sort by latest, most loved, most viewed, or top rated.</li>
            </ul>
          </div>

          <div className="help-card">
            <div className="help-icon"><FiMoon /></div>
            <h3>Dark Mode</h3>
            <ul>
              <li>Click the <strong>🌙 Moon/Sun</strong> icon in the navbar.</li>
              <li>Your preference is saved automatically.</li>
              <li>All pages adapt to your chosen theme.</li>
            </ul>
          </div>

          <div className="help-card">
            <div className="help-icon"><FiUser /></div>
            <h3>Your Account</h3>
            <ul>
              <li>Register with email, username, and password.</li>
              <li>Update your profile picture from your profile page.</li>
              <li>View your comments and reading history.</li>
            </ul>
          </div>

          <div className="help-card">
            <div className="help-icon"><FiMessageCircle /></div>
            <h3>Comments</h3>
            <ul>
              <li>Add comments on any story page.</li>
              <li>Comments require admin approval before appearing.</li>
              <li>Be respectful and constructive.</li>
              <li>View your comment status from your profile.</li>
            </ul>
          </div>
        </motion.div>

        <motion.div className="help-contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2>Still need help?</h2>
          <p>Contact us at <a href="mailto:gynaneshwar2261@gmail.com">gynaneshwar2261@gmail.com</a></p>
        </motion.div>
      </div>
    </div>
  );
};

export default Help;
