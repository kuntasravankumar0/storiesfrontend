import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import { FiUsers, FiBookOpen, FiHeadphones, FiMessageCircle, FiEye, FiHeart, FiEdit, FiLink } from 'react-icons/fi';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await adminAPI.getDashboard();
      setStats(res.data);
    } catch (err) {}
  };

  return (
    <div className="admin-page">
      <div className="container">
        <motion.div className="admin-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>📊 Admin Dashboard</h1>
          <p>Manage your Ink & Dreams platform</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <motion.div className="stat-card" whileHover={{ y: -5 }}>
            <div className="stat-icon users"><FiUsers /></div>
            <div className="stat-info">
              <span className="stat-value">{stats?.totalUsers || 0}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </motion.div>
          <motion.div className="stat-card" whileHover={{ y: -5 }}>
            <div className="stat-icon stories"><FiBookOpen /></div>
            <div className="stat-info">
              <span className="stat-value">{stats?.totalStories || 0}</span>
              <span className="stat-label">Total Stories</span>
            </div>
          </motion.div>
          <motion.div className="stat-card" whileHover={{ y: -5 }}>
            <div className="stat-icon audio"><FiHeadphones /></div>
            <div className="stat-info">
              <span className="stat-value">{stats?.totalAudioStories || 0}</span>
              <span className="stat-label">Audio Stories</span>
            </div>
          </motion.div>
          <motion.div className="stat-card" whileHover={{ y: -5 }}>
            <div className="stat-icon comments"><FiMessageCircle /></div>
            <div className="stat-info">
              <span className="stat-value">{stats?.pendingComments || 0}</span>
              <span className="stat-label">Pending Comments</span>
            </div>
          </motion.div>
        </div>

        {/* Top 5 Lists */}
        <div className="admin-info-grid">
          {stats?.topViewedStories && stats.topViewedStories.length > 0 && (
            <div className="info-block top-list">
              <h3><FiEye /> Top 5 Most Viewed</h3>
              <ol className="top-list-items">
                {stats.topViewedStories.map((story, idx) => (
                  <li key={story.id}>
                    <span className="top-rank">#{idx + 1}</span>
                    <span className="top-title">{story.title}</span>
                    <span className="top-stat">{story.viewCount} views</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {stats?.topLovedStories && stats.topLovedStories.length > 0 && (
            <div className="info-block top-list">
              <h3><FiHeart /> Top 5 Most Loved</h3>
              <ol className="top-list-items">
                {stats.topLovedStories.map((story, idx) => (
                  <li key={story.id}>
                    <span className="top-rank">#{idx + 1}</span>
                    <span className="top-title">{story.title}</span>
                    <span className="top-stat">{story.loveCount} ❤️</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Admin Navigation */}
        <div className="admin-nav-grid">
          <Link to="/admin/approvals" className="admin-nav-card">
            <FiBookOpen /> <span>Content Approvals</span>
          </Link>
          <Link to="/admin/stories" className="admin-nav-card">
            <FiBookOpen /> <span>Manage Stories</span>
          </Link>
          <Link to="/admin/audio-stories" className="admin-nav-card">
            <FiHeadphones /> <span>Audio Stories</span>
          </Link>
          <Link to="/admin/quotes" className="admin-nav-card">
            <FiEdit /> <span>Manage Quotes</span>
          </Link>
          <Link to="/admin/users" className="admin-nav-card">
            <FiUsers /> <span>Manage Users</span>
          </Link>
          <Link to="/admin/comments" className="admin-nav-card">
            <FiMessageCircle /> <span>Moderate Comments</span>
          </Link>
          <Link to="/admin/writer-profile" className="admin-nav-card">
            <FiUsers /> <span>Writer Profile</span>
          </Link>
          <Link to="/admin/social-links" className="admin-nav-card">
            <FiLink /> <span>Social Links</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
