import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DayProfileVisualIcon } from '../components/AnimatedIcons';

// Curated modern vector avatar presets
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
];

export default function UserProfilePage() {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name,
        email,
        avatar,
        ...(newPassword ? { currentPassword, newPassword } : {}),
      };

      const res = await api.updateUserProfile(payload, token);
      console.log('UPDATE PROFILE RES:', res);

      if (res.success && res.data?.user) {
        updateUser(res.data.user);
        setMessage('Profile updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while updating profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="wealth-page-container">
      {/* TOP NAVIGATION BAR */}
      <div className="wealth-top-nav">
        <button
          type="button"
          className="wealth-back-btn"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>

        <div className="wealth-nav-right">
          <button
            type="button"
            className="wealth-secondary-btn"
            onClick={() => navigate('/day-profile')}
          >
            ⏰ Daily Routine Profile
          </button>
          <span className="health-nav-badge">
            ✦ ACCOUNT PROFILE SETTINGS
          </span>
        </div>
      </div>

      {/* HERO HEADER WITH AVATAR DISPLAY */}
      <header className="wealth-header" style={{ alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #ff4d6d',
                boxShadow: '0 0 20px rgba(255, 77, 109, 0.6)',
              }}
            />
          ) : (
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e11d48, #be123c)',
                color: '#ffffff',
                fontSize: '32px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(225, 29, 72, 0.6)',
              }}
            >
              {(name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div>
          <span className="eyebrow health-eyebrow">MY ACCOUNT & IDENTITY</span>
          <h1 className="wealth-title">{name || 'User Profile'}</h1>
          <p className="wealth-subtitle">
            Update your account credentials, avatar picture, display name, and password security.
          </p>
        </div>
      </header>

      {/* ALERTS */}
      {error && (
        <div className="wealth-alert wealth-alert-error">
          <span>⚠️</span> {error}
        </div>
      )}
      {message && (
        <div className="wealth-alert wealth-alert-success">
          <span>✅</span> {message}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="wealth-form">
        {/* SECTION 1: PERSONAL DETAILS & AVATAR */}
        <section className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step health-step">1</span>
            <h3>Identity & Avatar Settings</h3>
          </div>
          <p className="section-desc">Manage your full name, email address, and profile picture avatar.</p>

          <div className="wealth-grid-2" style={{ marginBottom: '24px' }}>
            <div className="form-group">
              <label htmlFor="profileName">Full Name</label>
              <input
                type="text"
                id="profileName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="profileEmail">Email Address</label>
              <input
                type="email"
                id="profileEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          {/* AVATAR SELECTOR PRESETS */}
          <div className="form-group">
            <label>Choose Profile Avatar Preset</label>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '10px', marginBottom: '16px' }}>
              {AVATAR_PRESETS.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Avatar ${idx + 1}`}
                  onClick={() => setAvatar(url)}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: avatar === url ? '3px solid #ff4d6d' : '2px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: avatar === url ? '0 0 16px rgba(255, 77, 109, 0.8)' : 'none',
                    transition: 'all 0.25s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* CUSTOM IMAGE URL */}
          <div className="form-group">
            <label htmlFor="customAvatar">Or Enter Custom Image URL</label>
            <input
              type="url"
              id="customAvatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/my-photo.jpg"
            />
            <small className="form-help">Direct URL link to any image online</small>
          </div>
        </section>

        {/* SECTION 2: PASSWORD SECURITY */}
        <section className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step health-step">2</span>
            <h3>Security & Password Update</h3>
          </div>
          <p className="section-desc">Optional: Update your account password to keep your profile secure.</p>

          <div className="wealth-grid-3">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
              <small className="form-help">Required only if changing password</small>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
              />
            </div>
          </div>
        </section>

        {/* SUBMIT BUTTON */}
        <div className="wealth-submit-row">
          <button
            type="submit"
            className="health-submit-btn"
            disabled={saving}
            style={{ width: '100%', padding: '18px' }}
          >
            {saving ? 'Saving Profile Updates...' : '✦ Save Profile Updates'}
          </button>
        </div>
      </form>
    </div>
  );
}
