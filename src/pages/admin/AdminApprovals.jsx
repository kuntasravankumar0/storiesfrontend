import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../../services/api';
import { FiCheck, FiX, FiBookOpen, FiHeadphones } from 'react-icons/fi';
import './Admin.css';

const AdminApprovals = () => {
  const [activeTab, setActiveTab] = useState('stories');
  const [pendingStories, setPendingStories] = useState([]);
  const [pendingAudios, setPendingAudios] = useState([]);
  const [storyPages, setStoryPages] = useState(0);
  const [audioPages, setAudioPages] = useState(0);

  useEffect(() => { loadPending(); }, []);

  const loadPending = async () => {
    try {
      const res = await adminAPI.getPendingStories(0, 50);
      setPendingStories(res.data.content || []);
      setStoryPages(res.data.totalPages || 0);
    } catch (err) {}
    try {
      const res = await adminAPI.getPendingAudios(0, 50);
      setPendingAudios(res.data.content || []);
      setAudioPages(res.data.totalPages || 0);
    } catch (err) {}
  };

  const handleApproveStory = async (id) => {
    try {
      await adminAPI.approveStory(id);
      toast.success('Story approved and published!');
      loadPending();
    } catch (err) { toast.error('Failed to approve'); }
  };

  const handleRejectStory = async (id) => {
    if (!window.confirm('Reject and delete this story?')) return;
    try {
      await adminAPI.rejectStory(id);
      toast.success('Story rejected');
      loadPending();
    } catch (err) { toast.error('Failed to reject'); }
  };

  const handleApproveAudio = async (id) => {
    try {
      await adminAPI.approveAudio(id);
      toast.success('Audio story approved and published!');
      loadPending();
    } catch (err) { toast.error('Failed to approve'); }
  };

  const handleRejectAudio = async (id) => {
    if (!window.confirm('Reject and delete this audio story?')) return;
    try {
      await adminAPI.rejectAudio(id);
      toast.success('Audio story rejected');
      loadPending();
    } catch (err) { toast.error('Failed to reject'); }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>✅ Content Approvals</h1>
          <p>Review and approve user-submitted content</p>
        </div>

        {/* Tabs */}
        <div className="approval-tabs">
          <button className={`approval-tab ${activeTab === 'stories' ? 'active' : ''}`} onClick={() => setActiveTab('stories')}>
            <FiBookOpen /> Pending Stories <span className="count-badge">{pendingStories.length}</span>
          </button>
          <button className={`approval-tab ${activeTab === 'audios' ? 'active' : ''}`} onClick={() => setActiveTab('audios')}>
            <FiHeadphones /> Pending Audio <span className="count-badge">{pendingAudios.length}</span>
          </button>
        </div>

        {/* Pending Stories */}
        {activeTab === 'stories' && (
          <>
            {pendingStories.length === 0 ? (
              <div className="empty-state"><h3>No pending stories</h3><p>All user stories have been reviewed!</p></div>
            ) : (
              <div className="approval-list">
                {pendingStories.map(story => (
                  <div key={story.id} className="approval-card">
                    <div className="approval-card-image">
                      <img src={story.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'} alt="" />
                    </div>
                    <div className="approval-card-info">
                      <h3>{story.title}</h3>
                      <div className="approval-meta">
                        <span>By: {story.author}</span>
                        <span>Genre: {story.genre}</span>
                        <span>Language: {story.language}</span>
                        <span>{story.readingTimeMinutes} min read</span>
                      </div>
                    </div>
                    <div className="approval-actions">
                      <button className="approve-btn" onClick={() => handleApproveStory(story.id)}>
                        <FiCheck /> Approve
                      </button>
                      <button className="reject-btn" onClick={() => handleRejectStory(story.id)}>
                        <FiX /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pending Audio */}
        {activeTab === 'audios' && (
          <>
            {pendingAudios.length === 0 ? (
              <div className="empty-state"><h3>No pending audio stories</h3><p>All user audio has been reviewed!</p></div>
            ) : (
              <div className="approval-list">
                {pendingAudios.map(audio => (
                  <div key={audio.id} className="approval-card">
                    <div className="approval-card-image">
                      <img src={audio.coverImageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'} alt="" />
                    </div>
                    <div className="approval-card-info">
                      <h3>{audio.title}</h3>
                      <div className="approval-meta">
                        <span>By: {audio.author}</span>
                        <span>Genre: {audio.genre}</span>
                        <span>{Math.floor(audio.durationSeconds / 60)} min</span>
                      </div>
                      {audio.audioUrl && <a href={audio.audioUrl} target="_blank" rel="noopener noreferrer" className="preview-link">🎧 Preview Audio</a>}
                    </div>
                    <div className="approval-actions">
                      <button className="approve-btn" onClick={() => handleApproveAudio(audio.id)}>
                        <FiCheck /> Approve
                      </button>
                      <button className="reject-btn" onClick={() => handleRejectAudio(audio.id)}>
                        <FiX /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminApprovals;
