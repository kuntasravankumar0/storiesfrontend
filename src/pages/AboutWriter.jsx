import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { writerAPI, socialAPI } from '../services/api';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiLinkedin, FiGlobe, FiBookOpen } from 'react-icons/fi';
import './AboutWriter.css';

const AboutWriter = () => {
  const [profile, setProfile] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    loadProfile();
    loadSocial();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await writerAPI.getProfile();
      setProfile(res.data);
    } catch (err) {}
  };

  const loadSocial = async () => {
    try {
      const res = await socialAPI.getAll();
      setSocialLinks(res.data);
    } catch (err) {}
  };

  const getIcon = (platform) => {
    const name = platform?.toLowerCase();
    if (name?.includes('instagram')) return <FiInstagram />;
    if (name?.includes('twitter') || name?.includes('x')) return <FiTwitter />;
    if (name?.includes('facebook')) return <FiFacebook />;
    if (name?.includes('youtube')) return <FiYoutube />;
    if (name?.includes('linkedin')) return <FiLinkedin />;
    return <FiGlobe />;
  };

  return (
    <div className="about-page">
      <div className="container">
        <motion.div 
          className="about-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>About the Writer</h1>
        </motion.div>

        <div className="about-content">
          <motion.div 
            className="about-photo-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {profile?.photoUrl ? (
              <img src={profile.photoUrl} alt="Writer" className="writer-photo" />
            ) : (
              <div className="writer-photo-placeholder">
                <FiBookOpen />
              </div>
            )}
            {socialLinks.length > 0 && (
              <div className="writer-social">
                {socialLinks.map(link => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="social-link">
                    {getIcon(link.platform)}
                    <span>{link.platform}</span>
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div 
            className="about-text-section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {profile?.biography && (
              <div className="about-block">
                <h2>📖 Biography</h2>
                <p>{profile.biography}</p>
              </div>
            )}

            {profile?.writingJourney && (
              <div className="about-block">
                <h2>✍️ Writing Journey</h2>
                <p>{profile.writingJourney}</p>
              </div>
            )}

            {profile?.achievements && (
              <div className="about-block">
                <h2>🏆 Achievements</h2>
                <p>{profile.achievements}</p>
              </div>
            )}

            {profile?.numberOfStoriesWritten > 0 && (
              <div className="stats-card">
                <div className="stat-item">
                  <span className="stat-number">{profile.numberOfStoriesWritten}</span>
                  <span className="stat-label">Stories Written</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutWriter;
