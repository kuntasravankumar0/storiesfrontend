import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { adminAPI, writerAPI } from '../../services/api';
import './Admin.css';

const AdminWriterProfile = () => {
  const [form, setForm] = useState({
    photoUrl: '', biography: '', writingJourney: '', achievements: '', numberOfStoriesWritten: 0, socialMediaLinks: ''
  });

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const res = await writerAPI.getProfile();
      if (res.data) {
        setForm({
          photoUrl: res.data.photoUrl || '',
          biography: res.data.biography || '',
          writingJourney: res.data.writingJourney || '',
          achievements: res.data.achievements || '',
          numberOfStoriesWritten: res.data.numberOfStoriesWritten || 0,
          socialMediaLinks: res.data.socialMediaLinks || ''
        });
      }
    } catch (err) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateWriterProfile(form);
      toast.success('Writer profile updated!');
    } catch (err) { toast.error('Failed to update'); }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>✍️ Writer Profile</h1>
          <p>Update your public writer profile</p>
        </div>

        <motion.form className="admin-form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="full-width">
            <label>Photo URL</label>
            <input value={form.photoUrl} onChange={(e) => setForm({...form, photoUrl: e.target.value})} placeholder="https://..." />
          </div>
          <div className="full-width">
            <label>Biography</label>
            <textarea value={form.biography} onChange={(e) => setForm({...form, biography: e.target.value})} rows={4} />
          </div>
          <div className="full-width">
            <label>Writing Journey</label>
            <textarea value={form.writingJourney} onChange={(e) => setForm({...form, writingJourney: e.target.value})} rows={4} />
          </div>
          <div className="full-width">
            <label>Achievements</label>
            <textarea value={form.achievements} onChange={(e) => setForm({...form, achievements: e.target.value})} rows={3} />
          </div>
          <div>
            <label>Number of Stories Written</label>
            <input type="number" value={form.numberOfStoriesWritten} onChange={(e) => setForm({...form, numberOfStoriesWritten: parseInt(e.target.value)})} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Save Profile</button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default AdminWriterProfile;
