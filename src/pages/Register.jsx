import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', mobileNumber: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) { toast.error('Please fill required fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const response = await authAPI.register(form);
      const data = response.data;
      login({
        userId: data.userId,
        username: data.username,
        email: data.email,
        role: data.role,
        profilePictureUrl: data.profilePictureUrl,
      }, data.token);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="auth-header">
          <h1>Join Ink & Dreams</h1>
          <p>Create your account and start your reading journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <FiUser className="input-icon" />
            <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FiMail className="input-icon" />
            <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password (min 6 chars)" value={form.password} onChange={handleChange} required />
            <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className="input-group">
            <FiPhone className="input-icon" />
            <input type="tel" name="mobileNumber" placeholder="Mobile number (optional)" value={form.mobileNumber} onChange={handleChange} />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
