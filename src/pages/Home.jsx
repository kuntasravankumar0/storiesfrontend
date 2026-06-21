import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storyAPI, quoteAPI } from '../services/api';
import { FiBookOpen, FiHeadphones, FiFeather, FiArrowRight } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const [featuredStories, setFeaturedStories] = useState([]);
  const [trendingStories, setTrendingStories] = useState([]);
  const [latestStories, setLatestStories] = useState([]);
  const [popularQuotes, setPopularQuotes] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [featured, trending, latest, quotes] = await Promise.all([
        storyAPI.getFeatured().catch(() => ({ data: [] })),
        storyAPI.getTrending().catch(() => ({ data: [] })),
        storyAPI.getLatest().catch(() => ({ data: [] })),
        quoteAPI.getPopular().catch(() => ({ data: [] })),
      ]);
      setFeaturedStories(featured.data);
      setTrendingStories(trending.data);
      setLatestStories(latest.data);
      setPopularQuotes(quotes.data);
    } catch (err) {
      console.error('Error loading home data:', err);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-particles"></div>
        </div>
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Where Dreams Become <span className="highlight">Stories</span>
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Stories Born from Imagination and Written with Passion.
          </motion.p>
          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link to="/stories" className="btn-primary">
              <FiBookOpen /> Start Reading
            </Link>
            <Link to="/audio-stories" className="btn-secondary">
              <FiHeadphones /> Listen Now
            </Link>
          </motion.div>
        </motion.div>
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <img src="https://dev-maheshstores.pantheonsite.io/wp-content/uploads/2026/06/WhatsApp-Image-2026-06-20-at-7.21.53-PM.jpeg" alt="Ink & Dreams" className="hero-logo-img" />
        </motion.div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <motion.div 
          className="video-wrapper"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <iframe 
            src="https://www.youtube.com/embed/U37Pmv1RK2M?rel=0&modestbranding=1&showinfo=0" 
            title="Ink & Dreams" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <motion.div 
              className="feature-card"
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(123, 44, 191, 0.2)' }}
            >
              <div className="feature-icon"><FiBookOpen /></div>
              <h3>Written Stories</h3>
              <p>Immerse yourself in captivating tales across multiple genres and languages.</p>
            </motion.div>
            <motion.div 
              className="feature-card"
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(233, 69, 96, 0.2)' }}
            >
              <div className="feature-icon"><FiHeadphones /></div>
              <h3>Audio Stories</h3>
              <p>Listen to stories narrated with emotion, perfect for on-the-go moments.</p>
            </motion.div>
            <motion.div 
              className="feature-card"
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(212, 168, 83, 0.2)' }}
            >
              <div className="feature-icon"><FiFeather /></div>
              <h3>Inspiring Quotes</h3>
              <p>Find words that resonate with your soul, from love to motivation.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Featured Stories</h2>
              <Link to="/stories" className="see-all">See All <FiArrowRight /></Link>
            </div>
            <div className="stories-grid">
              {featuredStories.slice(0, 4).map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/stories/${story.id}`} className="story-card">
                    <div className="story-card-image">
                      <img src={story.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'} alt={story.title} />
                      <div className="story-card-overlay">
                        <span className="story-genre">{story.genre}</span>
                      </div>
                    </div>
                    <div className="story-card-content">
                      <h3>{story.title}</h3>
                      <p className="story-author">by {story.author}</p>
                      <div className="story-meta">
                        <span>{story.readingTimeMinutes} min read</span>
                        <span>❤️ {story.loveCount}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Stories */}
      {trendingStories.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <h2>🔥 Trending Stories</h2>
              <Link to="/stories" className="see-all">See All <FiArrowRight /></Link>
            </div>
            <div className="stories-grid">
              {trendingStories.slice(0, 4).map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/stories/${story.id}`} className="story-card">
                    <div className="story-card-image">
                      <img src={story.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'} alt={story.title} />
                      <div className="story-card-overlay">
                        <span className="story-genre">{story.genre}</span>
                      </div>
                    </div>
                    <div className="story-card-content">
                      <h3>{story.title}</h3>
                      <p className="story-author">by {story.author}</p>
                      <div className="story-meta">
                        <span>{story.readingTimeMinutes} min read</span>
                        <span>👁️ {story.viewCount}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Stories */}
      {latestStories.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>📖 Recently Added</h2>
              <Link to="/stories" className="see-all">See All <FiArrowRight /></Link>
            </div>
            <div className="stories-grid">
              {latestStories.slice(0, 4).map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/stories/${story.id}`} className="story-card">
                    <div className="story-card-image">
                      <img src={story.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'} alt={story.title} />
                      <div className="story-card-overlay">
                        <span className="story-genre">{story.genre}</span>
                      </div>
                    </div>
                    <div className="story-card-content">
                      <h3>{story.title}</h3>
                      <p className="story-author">by {story.author}</p>
                      <div className="story-meta">
                        <span>{story.readingTimeMinutes} min read</span>
                        <span>{story.language}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Quotes */}
      {popularQuotes.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <h2>💫 Popular Quotes</h2>
              <Link to="/quotes" className="see-all">See All <FiArrowRight /></Link>
            </div>
            <div className="quotes-grid">
              {popularQuotes.slice(0, 6).map((quote, index) => (
                <motion.div
                  key={quote.id}
                  className="quote-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <p className="quote-text">"{quote.text}"</p>
                  <span className="quote-author">— {quote.author || 'Ink & Dreams'}</span>
                  <span className="quote-category">{quote.category}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Explore Amazing Stories?</h2>
          <p>Join our community of readers and discover stories that touch your heart.</p>
          <Link to="/register" className="btn-primary btn-large">
            Get Started Free <FiArrowRight />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
