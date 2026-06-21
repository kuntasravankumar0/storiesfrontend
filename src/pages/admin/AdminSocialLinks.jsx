import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { adminAPI, socialAPI } from '../../services/api';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import './Admin.css';

const AdminSocialLinks = () => {
  const [links, setLinks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ platform: '', url: '', iconUrl: '' });

  useEffect(() => { loadLinks(); }, []);

  const loadLinks = async () => {
    try {
      const res = await socialAPI.getAll();
      setLinks(res.data);
    } catch (err) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminAPI.updateSocialLink(editingId, form);
        toast.success('Link updated!');
      } else {
        await adminAPI.createSocialLink(form);
        toast.success('Link created!');
      }
      resetForm();
      loadLinks();
    } catch (err) { toast.error('Failed to save'); }
  };

  const handleEdit = (link) => {
    setForm({ platform: link.platform, url: link.url, iconUrl: link.iconUrl || '' });
    setEditingId(link.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this link?')) return;
    try { await adminAPI.deleteSocialLink(id); toast.success('Deleted!'); loadLinks(); }
    catch (err) { toast.error('Failed'); }
  };

  const resetForm = () => {
    setForm({ platform: '', url: '', iconUrl: '' });
    setEditingId(null); setShowForm(false);
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>🔗 Social Media Links</h1>
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
            <FiPlus /> {showForm ? 'Cancel' : 'Add Link'}
          </button>
        </div>

        {showForm && (
          <motion.form className="admin-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div><label>Platform *</label><input value={form.platform} onChange={(e) => setForm({...form, platform: e.target.value})} required placeholder="e.g. Instagram, Twitter, YouTube" /></div>
            <div><label>URL *</label><input value={form.url} onChange={(e) => setForm({...form, url: e.target.value})} required placeholder="https://..." /></div>
            <div><label>Icon URL (optional)</label><input value={form.iconUrl} onChange={(e) => setForm({...form, iconUrl: e.target.value})} /></div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'}</button>
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </motion.form>
        )}

        <div className="admin-table-container">
          <table className="admin-table">
            <thead><tr><th>Platform</th><th>URL</th><th>Actions</th></tr></thead>
            <tbody>
              {links.map(link => (
                <tr key={link.id}>
                  <td><strong>{link.platform}</strong></td>
                  <td><a href={link.url} target="_blank" rel="noopener noreferrer" style={{color:'var(--accent)'}}>{link.url}</a></td>
                  <td>
                    <div className="table-actions">
                      <button className="table-btn edit" onClick={() => handleEdit(link)}><FiEdit /></button>
                      <button className="table-btn delete" onClick={() => handleDelete(link.id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSocialLinks;
