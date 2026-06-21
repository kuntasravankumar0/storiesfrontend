import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../../services/api';
import { FiUserX, FiTrash2, FiShield } from 'react-icons/fi';
import './Admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => { loadUsers(); }, [page]);

  const loadUsers = async () => {
    try {
      const res = await adminAPI.getUsers(page, 20);
      setUsers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {}
  };

  const handleBlock = async (id) => {
    try { await adminAPI.blockUser(id); toast.success('User status updated!'); loadUsers(); }
    catch (err) { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try { await adminAPI.deleteUser(id); toast.success('User deleted!'); loadUsers(); }
    catch (err) { toast.error('Failed to delete'); }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>👥 Manage Users</h1>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.username}</strong></td>
                  <td>{u.email}</td>
                  <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                  <td><span className={`status-badge ${u.blocked ? 'blocked' : 'active'}`}>{u.blocked ? 'Blocked' : 'Active'}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.role !== 'ADMIN' && (
                      <div className="table-actions">
                        <button className="table-btn block" onClick={() => handleBlock(u.id)}>
                          <FiShield /> {u.blocked ? 'Unblock' : 'Block'}
                        </button>
                        <button className="table-btn delete" onClick={() => handleDelete(u.id)}><FiTrash2 /></button>
                      </div>
                    )}
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

export default AdminUsers;
