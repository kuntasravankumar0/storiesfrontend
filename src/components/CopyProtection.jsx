import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './CopyProtection.css';

const CopyProtection = ({ children }) => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Per-user storage key
  const getStorageKey = () => {
    const userId = user?.userId || user?.email || 'guest';
    return `copyAttempts_${userId}`;
  };

  const [copyAttempts, setCopyAttempts] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const userId = JSON.parse(localStorage.getItem('user') || '{}')?.userId || 'guest';
    return parseInt(localStorage.getItem(`copyAttempts_${userId}`) || '0');
  });
  const [showWarning, setShowWarning] = useState(false);

  // Update storage when attempts change
  useEffect(() => {
    const key = getStorageKey();
    localStorage.setItem(key, copyAttempts.toString());
  }, [copyAttempts, user]);

  // Reset counter on user change
  useEffect(() => {
    const key = getStorageKey();
    const stored = parseInt(localStorage.getItem(key) || '0');
    setCopyAttempts(stored);
  }, [user?.userId]);

  const handleViolation = useCallback(async () => {
    // Don't apply to admin
    if (isAdmin()) return;

    const newCount = copyAttempts + 1;
    setCopyAttempts(newCount);

    if (newCount >= 13) {
      // Block the user
      if (isAuthenticated()) {
        try {
          await userAPI.blockSelf();
        } catch (e) {}
      }
      toast.error('⛔ Your account has been blocked due to repeated copy violations.');
      const key = getStorageKey();
      localStorage.removeItem(key);
      logout();
      navigate('/login');
      return;
    }

    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);

    if (newCount >= 10) {
      toast.error(`⚠️ WARNING: ${13 - newCount} more attempts will result in account block!`);
    } else if (newCount >= 5) {
      toast.warning(`⚠️ Copy attempt ${newCount}/13 detected. Your account may be blocked.`);
    } else {
      toast.warning('⚠️ Content is protected. Copying is not allowed.');
    }
  }, [copyAttempts, isAdmin, isAuthenticated, user]);

  useEffect(() => {
    // Don't add protection for admin users
    if (isAdmin()) return;

    const container = containerRef.current;
    if (!container) return;

    const preventCopy = (e) => {
      e.preventDefault();
      handleViolation();
    };

    const preventKeyboard = (e) => {
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'a' || e.key === 'A' || e.key === 'p' || e.key === 'P')) ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        handleViolation();
      }
    };

    const preventDrag = (e) => {
      e.preventDefault();
    };

    container.addEventListener('copy', preventCopy);
    container.addEventListener('cut', preventCopy);
    container.addEventListener('contextmenu', preventCopy);
    container.addEventListener('dragstart', preventDrag);
    document.addEventListener('keydown', preventKeyboard);

    return () => {
      container.removeEventListener('copy', preventCopy);
      container.removeEventListener('cut', preventCopy);
      container.removeEventListener('contextmenu', preventCopy);
      container.removeEventListener('dragstart', preventDrag);
      document.removeEventListener('keydown', preventKeyboard);
    };
  }, [isAdmin, handleViolation]);

  // If admin, render without protection
  if (isAdmin()) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="copy-protected">
      {showWarning && (
        <div className="copy-warning-overlay">
          <div className="copy-warning-box">
            <span className="warning-icon">🚫</span>
            <h3>Content Protected</h3>
            <p>Copying content from this story is not allowed.</p>
            <p className="attempt-count">Attempt {copyAttempts} of 13</p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default CopyProtection;
