import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { socialAPI } from '../services/api';
import { FiHeart, FiMail, FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiLinkedin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    socialAPI.getAll().then(res => setSocialLinks(res.data)).catch(() => {});
  }, []);

  const getIcon = (platform) => {
    const name = platform?.toLowerCase();
    if (name?.includes('instagram')) return <FiInstagram />;
    if (name?.includes('twitter') || name?.includes('x')) return <FiTwitter />;
    if (name?.includes('facebook')) return <FiFacebook />;
    if (name?.includes('youtube')) return <FiYoutube />;
    if (name?.includes('linkedin')) return <FiLinkedin />;
    return <FiMail />;
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3 className="footer-logo">Ink & Dreams</h3>
          <p className="footer-tagline">Where Dreams Become Stories</p>
          <p className="footer-quote">"Stories Born from Imagination and Written with Passion."</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/stories">Stories</Link>
          <Link to="/audio-stories">Audio Stories</Link>
          <Link to="/quotes">Quotes</Link>
          <Link to="/about">About Writer</Link>
        </div>

        <div className="footer-links">
          <h4>Categories</h4>
          <Link to="/stories?genre=LOVE">Love Stories</Link>
          <Link to="/stories?genre=THRILLER">Thriller</Link>
          <Link to="/stories?genre=MOTIVATION">Motivation</Link>
          <Link to="/stories?genre=FANTASY">Fantasy</Link>
        </div>

        <div className="footer-social">
          <h4>Connect</h4>
          <div className="social-icons">
            {socialLinks.map(link => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="social-icon">
                {getIcon(link.platform)}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 Ink & Dreams. All rights reserved.</p>
        <p className="footer-email">
          <FiMail /> gynaneshwar2261@gmail.com
        </p>
        <div className="footer-bottom-links">
          <Link to="/terms">Terms & Conditions</Link>
          <span>•</span>
          <Link to="/help">Help</Link>
        </div>
        <p className="made-with">Made with <FiHeart className="heart-icon" /> by Gynaneshwar</p>
      </div>
    </footer>
  );
};

export default Footer;
