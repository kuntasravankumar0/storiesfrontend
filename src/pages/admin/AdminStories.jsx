import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { adminAPI, storyAPI } from '../../services/api';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import StoryPageEditor from '../../components/StoryPageEditor';
import './Admin.css';

const AdminStories = () => {
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [storyPages, setStoryPages] = useState([{ blocks: [{ type: 'text', content: '', styles: { fontSize: '16px', fontFamily: 'Inter', color: '#000000', textAlign: 'left' } }] }]);
  const [form, setForm] = useState({
    title: '', coverImageUrl: '', author: '', genre: 'LOVE',
    language: 'ENGLISH', readingTimeMinutes: 5, featured: false, authorNote: ''
  });

  useEffect(() => { loadStories(); }, [page]);

  const loadStories = async () => {
    try {
      const res = await storyAPI.getAll(page, 10, 'createdAt');
      setStories(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {}
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  // Convert pages to stored format (JSON string in content field)
  const pagesToContent = (pages) => {
    return JSON.stringify(pages);
  };

  // Convert stored content back to pages
  const contentToPages = (content) => {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].blocks) {
        return parsed;
      }
    } catch (e) {}
    // Fallback: treat as plain text (old format)
    return [{ blocks: [{ type: 'text', content: content || '', styles: { fontSize: '16px', fontFamily: 'Inter', color: '#000000', textAlign: 'left' } }] }];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = pagesToContent(storyPages);
    // Collect all image URLs from pages for the inlineImageUrls field (for page viewer)
    const imageUrls = [];
    storyPages.forEach(p => {
      p.blocks.forEach(b => {
        if (b.type === 'image' && b.url) imageUrls.push(b.url);
      });
    });
    const submitData = { ...form, content, inlineImageUrls: imageUrls };
    try {
      if (editingId) {
        await adminAPI.updateStory(editingId, submitData);
        toast.success('Story updated!');
      } else {
        await adminAPI.createStory(submitData);
        toast.success('Story created!');
      }
      resetForm();
      loadStories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save story');
    }
  };

  const handleEdit = (story) => {
    setForm({
      title: story.title, coverImageUrl: story.coverImageUrl || '',
      author: story.author || '', genre: story.genre || 'LOVE', language: story.language || 'ENGLISH',
      readingTimeMinutes: story.readingTimeMinutes, featured: story.featured,
      authorNote: story.authorNote || ''
    });
    setStoryPages(contentToPages(story.content));
    setEditingId(story.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await adminAPI.deleteStory(id);
      toast.success('Story deleted!');
      loadStories();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const resetForm = () => {
    setForm({ title: '', coverImageUrl: '', author: '', genre: 'LOVE', language: 'ENGLISH', readingTimeMinutes: 5, featured: false, authorNote: '' });
    setStoryPages([{ blocks: [{ type: 'text', content: '', styles: { fontSize: '16px', fontFamily: 'Inter', color: '#000000', textAlign: 'left' } }] }]);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>📚 Manage Stories</h1>
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
            <FiPlus /> {showForm ? 'Cancel' : 'Add Story'}
          </button>
        </div>

        {showForm && (
          <motion.form className="admin-form story-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <label>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <label>Author</label>
              <input name="author" value={form.author} onChange={handleChange} />
            </div>
            <div>
              <label>Cover Image URL</label>
              <input name="coverImageUrl" value={form.coverImageUrl} onChange={handleChange} placeholder="https://..." />
            </div>
            <div>
              <label>Genre</label>
              <select name="genre" value={form.genre} onChange={handleChange}>
                {['LOVE','HORROR','THRILLER','COMEDY','DRAMA','FANTASY','MYSTERY','ADVENTURE','SCIFI','MOTIVATION','FRIENDSHIP','EMOTIONAL','ACTION'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Language</label>
              <select name="language" value={form.language} onChange={handleChange}>
                <option value="ENGLISH">English</option>
                <option value="TELUGU">Telugu</option>
                <option value="HINDI">Hindi</option>
              </select>
            </div>
            <div>
              <label>Reading Time (minutes)</label>
              <input name="readingTimeMinutes" type="number" value={form.readingTimeMinutes} onChange={handleChange} />
            </div>

            {/* Rich Story Page Editor */}
            <div className="full-width">
              <StoryPageEditor pages={storyPages} setPages={setStoryPages} />
            </div>

            <div className="full-width">
              <label>Author's Note</label>
              <textarea name="authorNote" value={form.authorNote} onChange={handleChange} rows={3} />
            </div>
            <div className="checkbox-group">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} id="featured" />
              <label htmlFor="featured">Featured Story</label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'} Story</button>
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </motion.form>
        )}

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cover</th><th>Title</th><th>Author</th><th>Genre</th><th>Language</th><th>Pages</th><th>Views</th><th>Loves</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stories.map(story => {
                let pageCount = 1;
                try { const p = JSON.parse(story.content); if (Array.isArray(p)) pageCount = p.length; } catch(e) {}
                return (
                  <tr key={story.id}>
                    <td><img src={story.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'} alt="" /></td>
                    <td><strong>{story.title}</strong></td>
                    <td>{story.author}</td>
                    <td>{story.genre}</td>
                    <td>{story.language}</td>
                    <td>{pageCount}</td>
                    <td>{story.viewCount}</td>
                    <td>{story.loveCount}</td>
                    <td>
                      <div className="table-actions">
                        <button className="table-btn edit" onClick={() => handleEdit(story)}><FiEdit /></button>
                        <button className="table-btn delete" onClick={() => handleDelete(story.id)}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0} className="page-btn">Prev</button>
            <span>Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page === totalPages-1} className="page-btn">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStories;
