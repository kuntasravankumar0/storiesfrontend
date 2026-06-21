import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storyAPI } from '../services/api';
import { FiSearch, FiFilter, FiHeart, FiEye, FiClock } from 'react-icons/fi';
import './Stories.css';

const GENRES = ['ALL', 'LOVE', 'HORROR', 'THRILLER', 'COMEDY', 'DRAMA', 'FANTASY', 'MYSTERY', 'ADVENTURE', 'SCIFI', 'MOTIVATION', 'FRIENDSHIP', 'EMOTIONAL', 'ACTION'];
const LANGUAGES = ['ALL', 'ENGLISH', 'TELUGU', 'HINDI'];
const READING_TIMES = [{ label: 'All', value: 0 }, { label: '3 min', value: 3 }, { label: '5 min', value: 5 }, { label: '10+ min', value: 10 }];

const Stories = () => {
  const [searchParams] = useSearchParams();
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [genre, setGenre] = useState(searchParams.get('genre') || 'ALL');
  const [language, setLanguage] = useState('ALL');
  const [readingTime, setReadingTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [loading, setLoading] = useState(true);

  // Update genre when URL params change (e.g. clicking footer category links)
  useEffect(() => {
    const urlGenre = searchParams.get('genre');
    if (urlGenre && urlGenre !== genre) {
      setGenre(urlGenre);
      setPage(0);
    }
  }, [searchParams]);

  useEffect(() => {
    loadStories();
  }, [page, genre, language, readingTime, sortBy]);

  const loadStories = async () => {
    setLoading(true);
    try {
      let response;
      if (searchQuery) {
        response = await storyAPI.search(searchQuery, page, 12);
      } else if (genre !== 'ALL') {
        response = await storyAPI.getByGenre(genre, page, 12);
      } else if (language !== 'ALL') {
        response = await storyAPI.getByLanguage(language, page, 12);
      } else if (readingTime > 0) {
        response = await storyAPI.getByReadingTime(readingTime, page, 12);
      } else {
        response = await storyAPI.getAll(page, 12, sortBy);
      }
      setStories(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error('Error loading stories:', err);
      setStories([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    loadStories();
  };

  return (
    <div className="stories-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>📚 Stories</h1>
          <p>Discover stories that inspire, entertain, and connect with your emotions</p>
        </motion.div>

        {/* Search & Filters */}
        <div className="filters-section">
          <form onSubmit={handleSearch} className="search-bar">
            <FiSearch />
            <input
              type="text"
              placeholder="Search stories by title, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div className="filter-groups">
            <div className="filter-group">
              <label><FiFilter /> Genre</label>
              <div className="filter-chips">
                {GENRES.map(g => (
                  <button
                    key={g}
                    className={`chip ${genre === g ? 'active' : ''}`}
                    onClick={() => { setGenre(g); setPage(0); }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group-inline">
                <label>Language</label>
                <select value={language} onChange={(e) => { setLanguage(e.target.value); setPage(0); }}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div className="filter-group-inline">
                <label>Reading Time</label>
                <select value={readingTime} onChange={(e) => { setReadingTime(Number(e.target.value)); setPage(0); }}>
                  {READING_TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div className="filter-group-inline">
                <label>Sort By</label>
                <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(0); }}>
                  <option value="createdAt">Latest</option>
                  <option value="loveCount">Most Loved</option>
                  <option value="viewCount">Most Viewed</option>
                  <option value="averageRating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="empty-state">
            <h3>No stories found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="stories-grid">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/stories/${story.id}`} className="story-card">
                  <div className="story-card-image">
                    <img src={story.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'} alt={story.title} />
                    <div className="story-card-overlay">
                      <span className="story-genre">{story.genre}</span>
                    </div>
                    {story.averageRating > 0 && (
                      <div className="story-rating">⭐ {story.averageRating.toFixed(1)}</div>
                    )}
                  </div>
                  <div className="story-card-content">
                    <h3>{story.title}</h3>
                    <p className="story-author">by {story.author}</p>
                    <div className="story-meta">
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))} 
              disabled={page === 0}
              className="page-btn"
            >
              Previous
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              const pageNum = page < 3 ? i : page - 2 + i;
              if (pageNum >= totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`page-btn ${page === pageNum ? 'active' : ''}`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button 
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
              disabled={page === totalPages - 1}
              className="page-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
