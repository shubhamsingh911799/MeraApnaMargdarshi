import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveGrowthReflection } from '../services/growthService';

export default function GrowthReflectionPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    wentWell: '',
    difficult: '',
    learnings: '',
    nextWeekImprovement: '',
    confidenceRating: 6,
    consistencyRating: 6,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await saveGrowthReflection(form, token);
      if (res.success) {
        setSuccess('✓ Weekly reflection submitted! Your adaptive roadmap has been updated.');
        setTimeout(() => navigate('/growth'), 1500);
      } else {
        setError(res.message || 'Failed to save reflection.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="wealth-page-container">
      {/* TOP NAV BAR */}
      <div className="wealth-top-nav">
        <button type="button" className="wealth-back-btn" onClick={() => navigate('/growth')}>
          ← Back to Growth
        </button>
        <span className="wealth-nav-badge">WEEKLY REFLECTION & ADAPTATION</span>
      </div>

      {/* HEADER */}
      <div className="wealth-header">
        <div className="wealth-header-icon">✍️</div>
        <div>
          <span className="eyebrow">REFLECTION RITUAL</span>
          <h1 className="wealth-title">Weekly Growth Reflection</h1>
          <p className="wealth-subtitle">
            The roadmap adapts to you, not you to the roadmap. Reflect on your week to fine-tune your actions.
          </p>
        </div>
      </div>

      {error && (
        <div className="wealth-alert wealth-alert-error" style={{ marginBottom: '20px' }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {success && (
        <div className="wealth-alert wealth-alert-success" style={{ marginBottom: '20px' }}>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="wealth-form">
        <div className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step">1</span>
            <h3>What went well this week?</h3>
          </div>
          <div className="form-group" style={{ marginLeft: '46px' }}>
            <textarea
              rows="3"
              placeholder="e.g. Completed 4 out of 5 daily actions and spoke up in class."
              value={form.wentWell}
              onChange={(e) => setForm({ ...form, wentWell: e.target.value })}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: '10px',
                width: '100%',
                outline: 'none',
              }}
            />
          </div>

          <div className="section-title-row" style={{ marginTop: '24px' }}>
            <span className="section-step">2</span>
            <h3>What was difficult or got in your way?</h3>
          </div>
          <div className="form-group" style={{ marginLeft: '46px' }}>
            <textarea
              rows="3"
              placeholder="e.g. Phone distraction before bed made me sleep late."
              value={form.difficult}
              onChange={(e) => setForm({ ...form, difficult: e.target.value })}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: '10px',
                width: '100%',
                outline: 'none',
              }}
            />
          </div>

          <div className="section-title-row" style={{ marginTop: '24px' }}>
            <span className="section-step">3</span>
            <h3>Self-Rated Weekly Performance (1 – 10)</h3>
          </div>
          <div className="wealth-grid-2" style={{ marginLeft: '46px', marginTop: '16px' }}>
            <div className="form-group">
              <label>Confidence Rating this week ({form.confidenceRating}/10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={form.confidenceRating}
                onChange={(e) => setForm({ ...form, confidenceRating: Number(e.target.value) })}
                style={{ accentColor: '#10b981', cursor: 'pointer' }}
              />
            </div>

            <div className="form-group">
              <label>Consistency Rating this week ({form.consistencyRating}/10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={form.consistencyRating}
                onChange={(e) => setForm({ ...form, consistencyRating: Number(e.target.value) })}
                style={{ accentColor: '#10b981', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '32px', textAlign: 'right' }}>
            <button type="submit" className="wealth-action-btn" disabled={saving}>
              {saving ? 'Submitting Reflection...' : 'Submit Reflection ✦'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
