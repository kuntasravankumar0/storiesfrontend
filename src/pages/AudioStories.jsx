import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { audioAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiPlay, FiPause, FiSearch, FiDownload, FiHeadphones } from 'react-icons/fi';
import './AudioStories.css';

const AudioStories = () => {
  const { isAuthenticated } = useAuth();
  const [audioStories, setAudioStories] = useState([]);
  const [mostPlayed, setMostPlayed] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [genre, setGenre] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  const GENRES = ['ALL', 'LOVE', 'HORROR', 'THRILLER', 'COMEDY', 'DRAMA', 'FANTASY', 'MYSTERY', 'MOTIVATION'];

  useEffect(() => {
    loadAudioStories();
    loadMostPlayed();
  }, [page, genre]);

  const loadAudioStories = async () => {
    setLoading(true);
    try {
      let response;
      if (searchQuery) {
        response = await audioAPI.search(searchQuery, page, 12);
      } else if (genre !== 'ALL') {
        response = await audioAPI.getByGenre(genre, page, 12);
      } else {
        response = await audioAPI.getAll(page, 12);
      }
      setAudioStories(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      setAudioStories([]);
    }
    setLoading(false);
  };

  const loadMostPlayed = async () => {
    try {
      const res = await audioAPI.getMostPlayed();
      setMostPlayed(res.data);
    } catch (err) {}
  };

  const handlePlay = (story) => {
    if (currentPlaying?.id === story.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentPlaying(story);
      setIsPlaying(true);
      setProgress(0);
      if (isAuthenticated()) {
        audioAPI.recordListen(story.id).catch(() => {});
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    loadAudioStories();
  };

  return (
    <div className="audio-page">
      <div className="container">
        <motion.div className="page-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>🎧 Audio Stories</h1>
          <p>Listen to stories narrated with emotion and passion</p>
        </motion.div>

        {/* Search */}
        <form onSubmit={handleSearch} className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search audio stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {/* Genre Filter */}
        <div className="filter-chips" style={{ marginBottom: '2rem' }}>
          {GENRES.map(g => (
            <button key={g} className={`chip ${genre === g ? 'active' : ''}`} onClick={() => { setGenre(g); setPage(0); }}>
              {g}
            </button>
          ))}
        </div>

        {/* Most Played */}
        {mostPlayed.length > 0 && (
          <div className="most-played-section">
            <h3><FiHeadphones /> Most Played</h3>
            <div className="most-played-list">
              {mostPlayed.slice(0, 5).map((story, idx) => (
                <motion.div
                  key={story.id}
                  className="most-played-item"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handlePlay(story)}
                >
                  <span className="rank">#{idx + 1}</span>
                  <img src={story.coverImageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'} alt={story.title} />
                  <div>
                    <h4>{story.title}</h4>
                    <span>{story.playCount} plays</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Audio Grid */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card"><div className="skeleton-image"></div><div className="skeleton-content"><div className="skeleton-line"></div></div></div>)}
          </div>
        ) : (
          <div className="audio-grid">
            {audioStories.map((story, index) => (
              <motion.div
                key={story.id}
                className={`audio-card ${currentPlaying?.id === story.id ? 'playing' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="audio-card-image" onClick={() => handlePlay(story)}>
                  <img src={story.coverImageUrl || 'https://dev-maheshstores.pantheonsite.io/wp-content/uploads/2025/05/IMG-20250517-WA0023-1536x1536.jpg'} alt={story.title} />
                  <div className="play-overlay">
                    {currentPlaying?.id === story.id && isPlaying ? <FiPause /> : <FiPlay />}
                  </div>
                </div>
                <div className="audio-card-content">
                  <h3>{story.title}</h3>
                  <p>{story.author}</p>
                  <div className="audio-meta">
                    <span>{formatTime(story.durationSeconds)}</span>
                    <span>{story.genre}</span>
                    {story.downloadable && story.audioUrl && (
                      <a href={story.audioUrl} download className="download-btn"><FiDownload /></a>
                    )}
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

      {/* Audio Player */}
      {currentPlaying && (
        <div className="audio-player-bar">
          <div className="player-info">
            <img src={currentPlaying.coverImageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60'} alt="" />
            <div>
              <h4>{currentPlaying.title}</h4>
              <span>{currentPlaying.author}</span>
            </div>
          </div>
          <div className="player-controls">
            <button onClick={() => handlePlay(currentPlaying)}>
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
            <div className="progress-bar" onClick={handleSeek}>
              <div className="progress-fill" style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}></div>
            </div>
            <span className="time">{formatTime(progress)} / {formatTime(duration || 0)}</span>
          </div>
          <audio
            ref={audioRef}
            src={currentPlaying.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            autoPlay
          />
        </div>
      )}
    </div>
  );
};

export default AudioStories;
