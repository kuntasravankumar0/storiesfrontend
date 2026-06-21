import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storyAPI } from '../services/api';
import { FiHeart, FiBookmark, FiClock, FiEye } from 'react-icons/fi';
import './MyLibrary.css';

const MyLibrary = () => {
  const [activeTab, setActiveTab] = useState('loved');
  const [lovedStories, setLovedStories] = useState([]);
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [loved, bookmarks] = await Promise.all([
        storyAPI.getMyLoved().catch(() => ({ data: [] })),
        storyAPI.getMyBookmarks().catch(() => ({ data: [] })),
      ]);
      setLovedStories(loved.data || []);
      setBookmarkedStories(bookmarks.data || []);
    } catch (err) {}
    setLoading(false);
  };

  const currentStories = activeTab === 'loved' ? lovedStories : bookmarkedStories;

  return (
    <div className="library-page">
      <div className="container">
        <motion.div className="page-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>📚 My Library</h1>
          <p>Your saved and loved stories in one place</p>
        </motion.div>

        {/* Tabs */}
        <div className="library-tabs">
          <button 
            className={`library-tab ${activeTab === 'loved' ? 'active' : ''}`}
            onClick={() => setActiveTab('loved')}
          >
            <FiHeart /> Loved Stories
            <span className="tab-count">{lovedStories.length}</span>
          </button>
          <button 
            className={`library-tab ${activeTab === 'bookmarked' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookmarked')}
          >
            <FiBookmark /> Bookmarked Stories
            <span className="tab-count">{bookmarkedStories.length}</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-content"><div className="skeleton-line"></div><div className="skeleton-line short"></div></div>
              </div>
            ))}
          </div>
        ) : currentStories.length === 0 ? (
          <motion.div className="empty-library" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="empty-icon">
              {activeTab === 'loved' ? '❤️' : '🔖'}
            </div>
            <h3>No {activeTab === 'loved' ? 'loved' : 'bookmarked'} stories yet</h3>
            <p>
              {activeTab === 'loved' 
                ? 'Start reading and tap the ❤️ button on stories you love!' 
                : 'Tap the 🔖 Save button on any story to bookmark it for later!'}
            </p>
            <Link to="/stories" className="btn-primary">Browse Stories</Link>
          </motion.div>
        ) : (
          <div className="library-grid">
            {currentStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/stories/${story.id}`} className="library-card">
                  <div className="library-card-image">
                    <img src={story.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'} alt={story.title} />
                    <div className="library-card-badge">
                      {activeTab === 'loved' ? <FiHeart /> : <FiBookmark />}
                    </div>
                  </div>
                  <div className="library-card-content">
                    <span className="library-genre">{story.genre}</span>
                    <h3>{story.title}</h3>
                    <p className="library-author">by {story.author}</p>
                    <div className="library-meta">
                      <span><FiClock /> {story.readingTimeMinutes} min</span>
                      <span><FiHeart /> {story.loveCount}</span>
                      <span><FiEye /> {story.viewCount}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLibrary;
