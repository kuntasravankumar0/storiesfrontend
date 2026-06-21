import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { quoteAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiCopy, FiShare2 } from 'react-icons/fi';
import './Quotes.css';

const CATEGORIES = ['ALL', 'LOVE', 'LIFE', 'MOTIVATION', 'FRIENDSHIP', 'SUCCESS', 'EMOTIONAL', 'INSPIRATIONAL'];

const Quotes = () => {
  const { isAuthenticated } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, [page, category]);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      let response;
      if (category !== 'ALL') {
        response = await quoteAPI.getByCategory(category, page, 12);
      } else {
        response = await quoteAPI.getAll(page, 12);
      }
      setQuotes(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      setQuotes([]);
    }
    setLoading(false);
  };

  const handleLike = async (quoteId) => {
    if (!isAuthenticated()) { toast.info('Please login to like quotes'); return; }
    try {
      await quoteAPI.like(quoteId);
      setQuotes(quotes.map(q => q.id === quoteId ? { ...q, likeCount: q.likeCount + 1 } : q));
    } catch (err) { toast.error('Failed to like quote'); }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Quote copied to clipboard!');
  };

  const handleShare = (quote) => {
    const text = `"${quote.text}" — ${quote.author || 'Ink & Dreams'}`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Quote copied for sharing!');
    }
  };

  return (
    <div className="quotes-page">
      <div className="container">
        <motion.div className="page-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>✨ Quotes</h1>
          <p>Words that inspire, motivate, and touch your soul</p>
        </motion.div>

        {/* Category Filter */}
        <div className="filter-chips" style={{ marginBottom: '2.5rem', justifyContent: 'center', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {CATEGORIES.map(c => (
            <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => { setCategory(c); setPage(0); }}>
              {c}
            </button>
          ))}
        </div>

        {/* Quotes */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card"><div className="skeleton-content"><div className="skeleton-line"></div><div className="skeleton-line short"></div></div></div>)}
          </div>
        ) : quotes.length === 0 ? (
          <div className="empty-state">
            <h3>No quotes found</h3>
            <p>Check back later for new quotes!</p>
          </div>
        ) : (
          <div className="quotes-masonry">
            {quotes.map((quote, index) => (
              <motion.div
                key={quote.id}
                className="quote-card-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, boxShadow: '0 15px 40px rgba(123, 44, 191, 0.15)' }}
              >
                <div className="quote-content">
                  <span className="quote-mark">"</span>
                  <p>{quote.text}</p>
                </div>
                <div className="quote-footer">
                  <div className="quote-info">
                    <span className="quote-author">— {quote.author || 'Ink & Dreams'}</span>
                    <span className="quote-cat">{quote.category}</span>
                  </div>
                  <div className="quote-actions">
                    <button onClick={() => handleLike(quote.id)} className="quote-action-btn">
                      <FiHeart /> {quote.likeCount}
                    </button>
                    <button onClick={() => handleCopy(quote.text)} className="quote-action-btn">
                      <FiCopy />
                    </button>
                    <button onClick={() => handleShare(quote)} className="quote-action-btn">
                      <FiShare2 />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="page-btn">Previous</button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              const pageNum = page < 3 ? i : page - 2 + i;
              if (pageNum >= totalPages) return null;
              return <button key={pageNum} onClick={() => setPage(pageNum)} className={`page-btn ${page === pageNum ? 'active' : ''}`}>{pageNum + 1}</button>;
            })}
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="page-btn">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quotes;
