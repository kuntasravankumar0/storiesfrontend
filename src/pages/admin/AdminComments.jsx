import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../../services/api';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import './Admin.css';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => { loadComments(); }, [page]);

  const loadComments = async () => {
    try {
      const res = await adminAPI.getPendingComments(page, 20);
      setComments(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {}
  };

  const handleApprove = async (id) => {
    try { await adminAPI.approveComment(id); toast.success('Comment approved!'); loadComments(); }
    catch (err) { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    try { await adminAPI.deleteComment(id); toast.success('Comment deleted!'); loadComments(); }
    catch (err) { toast.error('Failed'); }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>💬 Comment Moderation</h1>
          <p>Approve or reject pending comments</p>
        </div>

        {comments.length === 0 ? (
          <div className="empty-state">
            <h3>No pending comments</h3>
            <p>All comments have been moderated!</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>User</th><th>Story</th><th>Comment</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {comments.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.username}</strong></td>
                    <td>{c.storyTitle}</td>
                    <td style={{maxWidth:'300px'}}>{c.content}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        <button className="table-btn approve" onClick={() => handleApprove(c.id)}><FiCheck /> Approve</button>
                        <button className="table-btn delete" onClick={() => handleDelete(c.id)}><FiTrash2 /> Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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

export default AdminComments;
