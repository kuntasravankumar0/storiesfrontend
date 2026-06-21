import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { userAPI, commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiEdit2, FiMessageCircle, FiBookmark, FiHeart } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [profileUrl, setProfileUrl] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    loadProfile();
    loadComments();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await userAPI.getProfile();
      setProfile(res.data);
    } catch (err) {}
  };

  const loadComments = async () => {
    try {
      const res = await commentAPI.getMyComments();
      setComments(res.data);
    } catch (err) {}
  };

  const handleUpdateProfile = async () => {
    try {
      await userAPI.updateProfile(profileUrl);
      toast.success('Profile updated!');
      setEditingProfile(false);
      loadProfile();
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <motion.div className="profile-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="profile-avatar">
            {profile?.profilePictureUrl ? (
              <img src={profile.profilePictureUrl} alt="Profile" />
            ) : (
              <div className="avatar-placeholder"><FiUser /></div>
            )}
            <button className="edit-avatar-btn" onClick={() => setEditingProfile(true)}><FiEdit2 /></button>
          </div>
          <h1>{profile?.username || user?.username}</h1>
          <p className="profile-email"><FiMail /> {profile?.email || user?.email}</p>
          {profile?.mobileNumber && <p className="profile-phone"><FiPhone /> {profile.mobileNumber}</p>}
        </motion.div>

        {editingProfile && (
          <motion.div className="edit-profile-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>Update Profile Picture</h3>
            <div className="edit-profile-form">
              <input
                type="url"
                placeholder="Enter profile picture URL"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
              />
              <button onClick={handleUpdateProfile} className="btn-primary">Save</button>
              <button onClick={() => setEditingProfile(false)} className="btn-secondary">Cancel</button>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="profile-tabs">
          <button className={`tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
            <FiUser /> Profile Info
          </button>
          <button className={`tab ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => setActiveTab('comments')}>
            <FiMessageCircle /> My Comments
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'info' && (
            <div className="profile-info-grid">
              <div className="info-card">
                <FiUser />
                <div>
                  <label>Username</label>
                  <span>{profile?.username}</span>
                </div>
              </div>
              <div className="info-card">
                <FiMail />
                <div>
                  <label>Email</label>
                  <span>{profile?.email}</span>
                </div>
              </div>
              <div className="info-card">
                <FiPhone />
                <div>
                  <label>Mobile</label>
                  <span>{profile?.mobileNumber || 'Not provided'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="empty-text">No comments yet</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-body">
                      <div className="comment-header">
                        <strong>On: {comment.storyTitle}</strong>
                        <span className={`status ${comment.approved ? 'approved' : 'pending'}`}>
                          {comment.approved ? '✅ Approved' : '⏳ Pending'}
                        </span>
                      </div>
                      <p>{comment.content}</p>
                      <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
