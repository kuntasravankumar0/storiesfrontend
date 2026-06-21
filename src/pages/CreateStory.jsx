import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { storyAPI, audioAPI } from '../services/api';
import { FiPlus, FiSend, FiClock, FiCheck, FiBookOpen, FiHeadphones } from 'react-icons/fi';
import StoryPageEditor from '../components/StoryPageEditor';
import './CreateStory.css';

const CreateStory = () => {
  const [activeTab, setActiveTab] = useState('story');
  const [myStories, setMyStories] = useState([]);
  const [myAudios, setMyAudios] = useState([]);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [showAudioForm, setShowAudioForm] = useState(false);
  const [storyPages, setStoryPages] = useState([{ blocks: [{ type: 'text', content: '', styles: { fontSize: '16px', fontFamily: 'Inter', color: '#000000', textAlign: 'left' } }] }]);
  const [storyForm, setStoryForm] = useState({
    title: '', author: '', coverImageUrl: '', genre: 'LOVE', language: 'ENGLISH', readingTimeMinutes: 5, authorNote: ''
  });
  const [audioForm, setAudioForm] = useState({
    title: '', author: '', coverImageUrl: '', audioUrl: '', genre: 'LOVE', language: 'ENGLISH', durationSeconds: 180
  });

  useEffect(() => { loadMyContent(); }, []);

  const loadMyContent = async () => {
    try {
      const res = await storyAPI.getMyStories();
      setMyStories(res.data || []);
    } catch (err) {}
    try {
      const res = await audioAPI.getMyAudios();
      setMyAudios(res.data || []);
    } catch (err) {}
  };

  // Story handlers
  const handleStoryChange = (e) => {
    const { name, value } = e.target;
    setStoryForm({ ...storyForm, [name]: value });
  };

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    if (!storyForm.title.trim()) { toast.error('Please add a title'); return; }
    const content = JSON.stringify(storyPages);
    const imageUrls = [];
    storyPages.forEach(p => p.blocks.forEach(b => { if (b.type === 'image' && b.url) imageUrls.push(b.url); }));
    const submitData = { ...storyForm, content, inlineImageUrls: imageUrls, featured: false };
    try {
      await storyAPI.userCreate(submitData);
      toast.success('Story submitted for admin approval! 🎉');
      setStoryForm({ title: '', author: '', coverImageUrl: '', genre: 'LOVE', language: 'ENGLISH', readingTimeMinutes: 5, authorNote: '' });
      setStoryPages([{ blocks: [{ type: 'text', content: '', styles: { fontSize: '16px', fontFamily: 'Inter', color: '#000000', textAlign: 'left' } }] }]);
      setShowStoryForm(false);
      loadMyContent();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to submit'); }
  };

  // Audio handlers
  const handleAudioChange = (e) => {
    const { name, value } = e.target;
    setAudioForm({ ...audioForm, [name]: value });
  };

  const handleAudioSubmit = async (e) => {
    e.preventDefault();
    if (!audioForm.title.trim() || !audioForm.audioUrl.trim()) { toast.error('Title and Audio URL are required'); return; }
    try {
      await audioAPI.userCreate(audioForm);
      toast.success('Audio story submitted for admin approval! 🎧');
      setAudioForm({ title: '', author: '', coverImageUrl: '', audioUrl: '', genre: 'LOVE', language: 'ENGLISH', durationSeconds: 180 });
      setShowAudioForm(false);
      loadMyContent();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to submit'); }
  };

  return (
    <div className="create-story-page">
      <div className="container">
        <motion.div className="page-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>✍️ Create Your Own Content</h1>
          <p>Share stories and audio with the world. Content will be published after admin approval.</p>
        </motion.div>

        {/* Tabs */}
        <div className="create-tabs">
          <button className={`create-tab ${activeTab === 'story' ? 'active' : ''}`} onClick={() => setActiveTab('story')}>
            <FiBookOpen /> Written Stories
          </button>
          <button className={`create-tab ${activeTab === 'audio' ? 'active' : ''}`} onClick={() => setActiveTab('audio')}>
            <FiHeadphones /> Audio Stories
          </button>
        </div>

        {/* Story Tab */}
        {activeTab === 'story' && (
          <>
            <button className="btn-primary create-btn" onClick={() => setShowStoryForm(!showStoryForm)}>
              <FiPlus /> {showStoryForm ? 'Cancel' : 'Write New Story'}
            </button>

            {showStoryForm && (
              <motion.form className="create-story-form" onSubmit={handleStorySubmit} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="form-row">
                  <div className="form-field"><label>Title *</label><input name="title" value={storyForm.title} onChange={handleStoryChange} required placeholder="Story title..." /></div>
                  <div className="form-field"><label>Author *</label><input name="author" value={storyForm.author} onChange={handleStoryChange} required placeholder="Your pen name..." /></div>
                </div>
                <div className="form-row">
                  <div className="form-field"><label>Cover Image URL</label><input name="coverImageUrl" value={storyForm.coverImageUrl} onChange={handleStoryChange} placeholder="https://..." /></div>
                </div>
                <div className="form-row">
                  <div className="form-field"><label>Genre</label>
                    <select name="genre" value={storyForm.genre} onChange={handleStoryChange}>
                      {['LOVE','HORROR','THRILLER','COMEDY','DRAMA','FANTASY','MYSTERY','ADVENTURE','SCIFI','MOTIVATION','FRIENDSHIP','EMOTIONAL','ACTION'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="form-field"><label>Language</label>
                    <select name="language" value={storyForm.language} onChange={handleStoryChange}>
                      <option value="ENGLISH">English</option><option value="TELUGU">Telugu</option><option value="HINDI">Hindi</option>
                    </select>
                  </div>
                  <div className="form-field"><label>Reading Time (min)</label><input name="readingTimeMinutes" type="number" value={storyForm.readingTimeMinutes} onChange={handleStoryChange} min="1" /></div>
                </div>
                <StoryPageEditor pages={storyPages} setPages={setStoryPages} />
                <div className="form-field" style={{ marginTop: '1.5rem' }}><label>Author's Note</label><textarea name="authorNote" value={storyForm.authorNote} onChange={handleStoryChange} rows={3} placeholder="Optional note..." /></div>
                <div className="submit-section"><button type="submit" className="btn-primary submit-btn"><FiSend /> Submit Story</button><p className="submit-note">Will be reviewed by admin before publishing.</p></div>
              </motion.form>
            )}

            {myStories.length > 0 && (
              <div className="my-stories-section">
                <h2>📚 My Stories</h2>
                <div className="my-stories-list">
                  {myStories.map(story => (
                    <div key={story.id} className="my-story-card">
                      <div className="my-story-image"><img src={story.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'} alt="" /></div>
                      <div className="my-story-info"><h3>{story.title}</h3><div className="my-story-meta"><span>{story.genre}</span><span>{story.language}</span><span><FiClock /> {story.readingTimeMinutes} min</span></div></div>
                      <div className="my-story-status"><span className={`status-badge ${story.viewCount > 0 ? 'approved' : 'pending'}`}>{story.viewCount > 0 ? <><FiCheck /> Published</> : <><FiClock /> Pending</>}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Audio Tab */}
        {activeTab === 'audio' && (
          <>
            <button className="btn-primary create-btn" onClick={() => setShowAudioForm(!showAudioForm)}>
              <FiPlus /> {showAudioForm ? 'Cancel' : 'Add Audio Story'}
            </button>

            {showAudioForm && (
              <motion.form className="create-story-form" onSubmit={handleAudioSubmit} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="form-row">
                  <div className="form-field"><label>Title *</label><input name="title" value={audioForm.title} onChange={handleAudioChange} required placeholder="Audio title..." /></div>
                  <div className="form-field"><label>Author *</label><input name="author" value={audioForm.author} onChange={handleAudioChange} required placeholder="Your pen name..." /></div>
                </div>
                <div className="form-row">
                  <div className="form-field"><label>Audio URL *</label><input name="audioUrl" value={audioForm.audioUrl} onChange={handleAudioChange} required placeholder="https://...mp3" /></div>
                  <div className="form-field"><label>Cover Image URL</label><input name="coverImageUrl" value={audioForm.coverImageUrl} onChange={handleAudioChange} placeholder="https://..." /></div>
                </div>
                <div className="form-row">
                  <div className="form-field"><label>Genre</label>
                    <select name="genre" value={audioForm.genre} onChange={handleAudioChange}>
                      {['LOVE','HORROR','THRILLER','COMEDY','DRAMA','FANTASY','MYSTERY','ADVENTURE','SCIFI','MOTIVATION','FRIENDSHIP','EMOTIONAL','ACTION'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="form-field"><label>Language</label>
                    <select name="language" value={audioForm.language} onChange={handleAudioChange}>
                      <option value="ENGLISH">English</option><option value="TELUGU">Telugu</option><option value="HINDI">Hindi</option>
                    </select>
                  </div>
                  <div className="form-field"><label>Duration (seconds)</label><input name="durationSeconds" type="number" value={audioForm.durationSeconds} onChange={handleAudioChange} min="1" /></div>
                </div>
                <div className="submit-section"><button type="submit" className="btn-primary submit-btn"><FiSend /> Submit Audio</button><p className="submit-note">Will be reviewed by admin before publishing.</p></div>
              </motion.form>
            )}

            {myAudios.length > 0 && (
              <div className="my-stories-section">
                <h2>🎧 My Audio Stories</h2>
                <div className="my-stories-list">
                  {myAudios.map(audio => (
                    <div key={audio.id} className="my-story-card">
                      <div className="my-story-image"><img src={audio.coverImageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'} alt="" /></div>
                      <div className="my-story-info"><h3>{audio.title}</h3><div className="my-story-meta"><span>{audio.genre}</span><span>{audio.language}</span><span><FiClock /> {Math.floor(audio.durationSeconds/60)} min</span></div></div>
                      <div className="my-story-status"><span className={`status-badge ${audio.playCount > 0 ? 'approved' : 'pending'}`}>{audio.playCount > 0 ? <><FiCheck /> Published</> : <><FiClock /> Pending</>}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CreateStory;
