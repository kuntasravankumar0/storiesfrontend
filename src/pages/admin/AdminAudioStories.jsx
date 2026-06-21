import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { adminAPI, audioAPI } from '../../services/api';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import './Admin.css';

const AdminAudioStories = () => {
  const [audioStories, setAudioStories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '', coverImageUrl: '', audioUrl: '', author: '', genre: 'LOVE', language: 'ENGLISH', durationSeconds: 180, downloadable: false
  });

  useEffect(() => { loadData(); }, [page]);

  const loadData = async () => {
    try {
      const res = await audioAPI.getAll(page, 10);
      setAudioStories(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {}
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminAPI.updateAudioStory(editingId, form);
        toast.success('Audio story updated!');
      } else {
        await adminAPI.createAudioStory(form);
        toast.success('Audio story created!');
      }
      resetForm();
      loadData();
    } catch (err) { toast.error('Failed to save'); }
  };

  const handleEdit = (story) => {
    setForm({
      title: story.title, coverImageUrl: story.coverImageUrl || '', audioUrl: story.audioUrl || '',
      author: story.author || '', genre: story.genre || 'LOVE', language: story.language || 'ENGLISH',
      durationSeconds: story.durationSeconds, downloadable: story.downloadable
    });
    setEditingId(story.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try { await adminAPI.deleteAudioStory(id); toast.success('Deleted!'); loadData(); }
    catch (err) { toast.error('Failed to delete'); }
  };

  const resetForm = () => {
    setForm({ title: '', coverImageUrl: '', audioUrl: '', author: '', genre: 'LOVE', language: 'ENGLISH', durationSeconds: 180, downloadable: false });
    setEditingId(null); setShowForm(false);
  };

  const formatDuration = (seconds) => `${Math.floor(seconds/60)}:${(seconds%60).toString().padStart(2,'0')}`;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>🎧 Manage Audio Stories</h1>
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
            <FiPlus /> {showForm ? 'Cancel' : 'Add Audio Story'}
          </button>
        </div>

        {showForm && (
          <motion.form className="admin-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div><label>Title *</label><input name="title" value={form.title} onChange={handleChange} required /></div>
            <div><label>Author</label><input name="author" value={form.author} onChange={handleChange} /></div>
            <div><label>Cover Image URL</label><input name="coverImageUrl" value={form.coverImageUrl} onChange={handleChange} /></div>
            <div><label>Audio URL *</label><input name="audioUrl" value={form.audioUrl} onChange={handleChange} required /></div>
            <div>
              <label>Genre</label>
              <select name="genre" value={form.genre} onChange={handleChange}>
                {['LOVE','HORROR','THRILLER','COMEDY','DRAMA','FANTASY','MYSTERY','ADVENTURE','SCIFI','MOTIVATION','FRIENDSHIP','EMOTIONAL'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label>Language</label>
              <select name="language" value={form.language} onChange={handleChange}>
                <option value="ENGLISH">English</option><option value="TELUGU">Telugu</option><option value="HINDI">Hindi</option>
              </select>
            </div>
            <div><label>Duration (seconds)</label><input name="durationSeconds" type="number" value={form.durationSeconds} onChange={handleChange} /></div>
            <div className="checkbox-group">
              <input type="checkbox" name="downloadable" checked={form.downloadable} onChange={handleChange} id="downloadable" />
              <label htmlFor="downloadable">Allow Download</label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'}</button>
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </motion.form>
        )}

        <div className="admin-table-container">
          <table className="admin-table">
            <thead><tr><th>Cover</th><th>Title</th><th>Author</th><th>Duration</th><th>Genre</th><th>Plays</th><th>Actions</th></tr></thead>
            <tbody>
              {audioStories.map(s => (
                <tr key={s.id}>
                  <td><img src={s.coverImageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'} alt="" /></td>
                  <td><strong>{s.title}</strong></td>
                  <td>{s.author}</td>
                  <td>{formatDuration(s.durationSeconds)}</td>
                  <td>{s.genre}</td>
                  <td>{s.playCount}</td>
                  <td>
                    <div className="table-actions">
                      <button className="table-btn edit" onClick={() => handleEdit(s)}><FiEdit /></button>
                      <button className="table-btn delete" onClick={() => handleDelete(s.id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page===0} className="page-btn">Prev</button>
            <span>Page {page+1} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page===totalPages-1} className="page-btn">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAudioStories;
