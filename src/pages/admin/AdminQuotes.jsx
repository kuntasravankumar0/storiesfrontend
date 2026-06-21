import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { adminAPI, quoteAPI } from '../../services/api';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import './Admin.css';

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ text: '', author: '', category: 'MOTIVATION' });

  useEffect(() => { loadQuotes(); }, [page]);

  const loadQuotes = async () => {
    try {
      const res = await quoteAPI.getAll(page, 10);
      setQuotes(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminAPI.updateQuote(editingId, form);
        toast.success('Quote updated!');
      } else {
        await adminAPI.createQuote(form);
        toast.success('Quote created!');
      }
      resetForm();
      loadQuotes();
    } catch (err) { toast.error('Failed to save'); }
  };

  const handleEdit = (quote) => {
    setForm({ text: quote.text, author: quote.author || '', category: quote.category || 'MOTIVATION' });
    setEditingId(quote.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try { await adminAPI.deleteQuote(id); toast.success('Deleted!'); loadQuotes(); }
    catch (err) { toast.error('Failed to delete'); }
  };

  const resetForm = () => {
    setForm({ text: '', author: '', category: 'MOTIVATION' });
    setEditingId(null); setShowForm(false);
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>✨ Manage Quotes</h1>
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
            <FiPlus /> {showForm ? 'Cancel' : 'Add Quote'}
          </button>
        </div>

        {showForm && (
          <motion.form className="admin-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="full-width"><label>Quote Text *</label><textarea name="text" value={form.text} onChange={(e) => setForm({...form, text: e.target.value})} required rows={4} /></div>
            <div><label>Author</label><input value={form.author} onChange={(e) => setForm({...form, author: e.target.value})} /></div>
            <div>
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                {['LOVE','LIFE','MOTIVATION','FRIENDSHIP','SUCCESS','EMOTIONAL','INSPIRATIONAL'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'}</button>
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </motion.form>
        )}

        <div className="admin-table-container">
          <table className="admin-table">
            <thead><tr><th>Quote</th><th>Author</th><th>Category</th><th>Likes</th><th>Actions</th></tr></thead>
            <tbody>
              {quotes.map(q => (
                <tr key={q.id}>
                  <td style={{maxWidth:'300px'}}>{q.text?.substring(0, 80)}...</td>
                  <td>{q.author}</td>
                  <td>{q.category}</td>
                  <td>{q.likeCount}</td>
                  <td>
                    <div className="table-actions">
                      <button className="table-btn edit" onClick={() => handleEdit(q)}><FiEdit /></button>
                      <button className="table-btn delete" onClick={() => handleDelete(q.id)}><FiTrash2 /></button>
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

export default AdminQuotes;
