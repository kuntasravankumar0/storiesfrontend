import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { storyAPI, commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiBookmark, FiShare2, FiClock, FiEye, FiMessageCircle, FiVolume2, FiSquare } from 'react-icons/fi';
import ImageViewer from '../components/ImageViewer';
import CopyProtection from '../components/CopyProtection';
import './StoryDetail.css';

const StoryDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loved, setLoved] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const utteranceRef = useRef(null);

  useEffect(() => {
    loadStory();
    loadComments();
    loadVoices();
    loadUserStatus();
  }, [id]);

  const loadUserStatus = async () => {
    if (!isAuthenticated()) return;
    try {
      const res = await storyAPI.getStatus(id);
      setLoved(res.data.loved);
      setBookmarked(res.data.bookmarked);
    } catch (err) {}
  };

  const loadVoices = () => {
    const loadAvailable = () => {
      const available = window.speechSynthesis?.getVoices() || [];
      if (available.length > 0) {
        setVoices(available);
        // Default to first English voice
        const english = available.find(v => v.lang.startsWith('en'));
        if (english) setSelectedVoice(english.name);
      }
    };
    loadAvailable();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadAvailable;
    }
  };

  const loadStory = async () => {
    try {
      const response = await storyAPI.getById(id);
      setStory(response.data);
    } catch (err) {
      toast.error('Failed to load story');
    }
    setLoading(false);
  };

  const loadComments = async () => {
    try {
      const response = await commentAPI.getByStory(id);
      setComments(response.data);
    } catch (err) {}
  };

  const handleLove = async () => {
    if (!isAuthenticated()) { toast.info('Please login to love stories'); return; }
    try {
      await storyAPI.love(id);
      setLoved(!loved);
      setStory(prev => ({ ...prev, loveCount: loved ? prev.loveCount - 1 : prev.loveCount + 1 }));
      toast.success(loved ? 'Removed love' : 'Loved! ❤️');
    } catch (err) { toast.error('Failed to love story'); }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated()) { toast.info('Please login to bookmark stories'); return; }
    try {
      await storyAPI.bookmark(id);
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? 'Removed from bookmarks' : 'Bookmarked! 🔖');
    } catch (err) { toast.error('Failed to bookmark story'); }
  };

  const handleRate = async (value) => {
    if (!isAuthenticated()) { toast.info('Please login to rate stories'); return; }
    try {
      await storyAPI.rate(id, value);
      setUserRating(value);
      toast.success(`Rated ${value} stars!`);
      loadStory();
    } catch (err) { toast.error('Failed to rate story'); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isAuthenticated()) { toast.info('Please login to comment'); return; }
    try {
      await commentAPI.add(id, newComment);
      setNewComment('');
      toast.success('Comment submitted! It will appear after admin approval.');
    } catch (err) { toast.error('Failed to post comment'); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      toast.error('Speech synthesis not supported in your browser');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Extract text from content (handles both JSON pages and old plain text)
    let textContent = '';
    try {
      const parsed = JSON.parse(story.content);
      if (Array.isArray(parsed) && parsed[0]?.blocks) {
        parsed.forEach(page => {
          page.blocks.forEach(block => {
            if (block.type === 'text' && block.content) {
              textContent += block.content + '. ';
            }
          });
        });
      }
    } catch (e) {
      textContent = story.content
        ?.replace(/\[IMG:[^\]]*\]/g, '')
        ?.replace(/<[^>]*>/g, '')
        ?.replace(/\n+/g, '. ') || '';
    }

    const utterance = new SpeechSynthesisUtterance(textContent);
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Set selected voice
    if (selectedVoice) {
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    toast.info('🎙️ Reading story aloud...');
  };

  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Parse content - handles both new JSON page format and old plain text
  const parseStoryPages = (content) => {
    if (!content) return null;
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].blocks) {
        return parsed;
      }
    } catch (e) {}
    // Old format: plain text with [IMG:url] markers
    return null;
  };

  // Render old format content
  const renderOldContent = (content) => {
    if (!content) return null;
    const parts = content.split(/(\[IMG:[^\]]+\])/g);
    return parts.map((part, index) => {
      const imgMatch = part.match(/\[IMG:([^\]]+)\]/);
      if (imgMatch) {
        return (
          <div key={index} className="story-inline-image">
            <img src={imgMatch[1]} alt={`Story illustration`} />
          </div>
        );
      }
      if (part.trim()) {
        return <div key={index} className="story-text-block" dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br/>') }} />;
      }
      return null;
    });
  };

  // Render a single block from the new format
  const renderBlock = (block, idx) => {
    if (block.type === 'text') {
      const style = {
        fontWeight: block.styles?.bold ? 'bold' : 'normal',
        fontStyle: block.styles?.italic ? 'italic' : 'normal',
        textDecoration: block.styles?.underline ? 'underline' : 'none',
        textAlign: block.styles?.textAlign || 'left',
        fontSize: block.styles?.fontSize || '16px',
        fontFamily: block.styles?.fontFamily || 'Inter',
        color: block.styles?.color || 'inherit',
        lineHeight: 1.8,
        marginBottom: '1rem',
      };
      return (
        <div key={idx} className="story-text-block" style={style} dangerouslySetInnerHTML={{ __html: (block.content || '').replace(/\n/g, '<br/>') }} />
      );
    }
    if (block.type === 'image' && block.url) {
      return (
        <div key={idx} className="story-inline-image" style={{ textAlign: block.align || 'center' }}>
          <img src={block.url} alt="Story" style={{ width: block.width || '100%', height: block.height || 'auto', maxWidth: '100%' }} />
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;
  if (!story) return <div className="empty-state"><h3>Story not found</h3></div>;

  return (
    <div className="story-detail">
      <div className="container">
        <motion.div
          className="story-detail-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {story.coverImageUrl && (
            <div className="story-cover">
              <img src={story.coverImageUrl} alt={story.title} />
            </div>
          )}
          <div className="story-info">
            <span className="story-genre-badge">{story.genre}</span>
            <h1>{story.title}</h1>
            <p className="story-author-name">by {story.author}</p>
            <div className="story-stats">
              <span><FiClock /> {story.readingTimeMinutes} min read</span>
              <span><FiEye /> {story.viewCount} views</span>
              <span><FiHeart /> {story.loveCount} loves</span>
              <span><FiMessageCircle /> {story.commentCount} comments</span>
              <span>🌐 {story.language}</span>
            </div>

            {/* Rating */}
            <div className="rating-section">
              <div className="stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`star ${star <= (hoverRating || userRating || Math.round(story.averageRating)) ? 'filled' : ''}`}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <span className="rating-text">{story.averageRating?.toFixed(1)} / 5 ({story.ratingCount} ratings)</span>
            </div>

            {/* Actions */}
            <div className="story-actions">
              <button className={`action-btn ${loved ? 'active' : ''}`} onClick={handleLove}>
                <FiHeart /> {loved ? 'Loved' : 'Love'}
              </button>
              <button className={`action-btn ${bookmarked ? 'active' : ''}`} onClick={handleBookmark}>
                <FiBookmark /> {bookmarked ? 'Saved' : 'Save'}
              </button>
              <button className="action-btn" onClick={handleShare}>
                <FiShare2 /> Share
              </button>
              <button className={`action-btn ${isSpeaking ? 'active' : ''}`} onClick={() => setShowVoicePanel(!showVoicePanel)}>
                <FiVolume2 /> Listen
              </button>
            </div>

            {/* Voice Selection Panel */}
            {showVoicePanel && (
              <motion.div 
                className="voice-panel"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="voice-panel-header">
                  <h4>🎙️ Choose Voice</h4>
                </div>
                <div className="voice-select-row">
                  <select 
                    value={selectedVoice} 
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="voice-select"
                  >
                    {voices.map((voice, idx) => (
                      <option key={idx} value={voice.name}>
                        {voice.name} ({voice.lang}) {voice.name.toLowerCase().includes('female') || voice.name.includes('Zira') || voice.name.includes('Heera') ? '👩' : voice.name.toLowerCase().includes('male') || voice.name.includes('David') || voice.name.includes('Mark') ? '👨' : '🗣️'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="voice-actions">
                  {!isSpeaking ? (
                    <button className="btn-primary" onClick={handleSpeak}>
                      <FiVolume2 /> Start Reading
                    </button>
                  ) : (
                    <button className="btn-primary stop-btn" onClick={handleStopSpeaking}>
                      <FiSquare /> Stop
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Story Content - renders pages like A4 document */}
        <CopyProtection>
        <motion.div
          className="story-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {(() => {
            const storyPages = parseStoryPages(story.content);
            if (storyPages) {
              // New page-based format
              return (
                <div className="story-pages-viewer">
                  {storyPages.map((pg, pageIdx) => (
                    <div key={pageIdx} className="story-page-view">
                      <div className="story-page-number">Page {pageIdx + 1} / {storyPages.length}</div>
                      <div className="story-page-content">
                        {pg.blocks.map((block, blockIdx) => renderBlock(block, blockIdx))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            } else {
              // Old plain text format
              return renderOldContent(story.content);
            }
          })()}

          {/* Image Viewer Lightbox */}
          {showImageViewer && story.inlineImageUrls && (
            <ImageViewer
              images={story.inlineImageUrls}
              initialIndex={imageViewerIndex}
              onClose={() => setShowImageViewer(false)}
            />
          )}

          {/* Author Note */}
          {story.authorNote && (
            <div className="author-note">
              <h4>📝 Author's Note</h4>
              <p>{story.authorNote}</p>
            </div>
          )}
        </motion.div>
        </CopyProtection>

        {/* Comments Section */}
        <div className="comments-section">
          <h3><FiMessageCircle /> Comments ({comments.length})</h3>
          
          {isAuthenticated() && (
            <form onSubmit={handleComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this story..."
                rows={3}
              />
              <button type="submit" className="btn-primary">Post Comment</button>
            </form>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-avatar">
                    {comment.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="comment-body">
                    <div className="comment-header">
                      <strong>{comment.username}</strong>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
