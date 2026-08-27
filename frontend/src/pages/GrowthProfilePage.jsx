import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGrowthProfile } from '../services/growthService';

export default function GrowthProfilePage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getGrowthProfile(token);
        if (res.success && res.data?.growthProfile) {
          setProfile(res.data.growthProfile);
        }
      } catch (err) {
        console.error('Fetch profile settings error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="wealth-page-container">
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9ca3af' }}>
          <div className="day-profile-loader" style={{ margin: '0 auto 16px auto' }} />
          <strong>Loading Growth Profile settings...</strong>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="wealth-page-container">
        <div className="analysis-error-card">
          <h2>No active profile found.</h2>
          <button type="button" className="wealth-action-btn" onClick={() => navigate('/growth/assessment')}>
            Set Up Growth Profile Now →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wealth-page-container">
      {/* TOP NAV BAR */}
      <div className="wealth-top-nav">
        <button type="button" className="wealth-back-btn" onClick={() => navigate('/growth')}>
          ← Back to Growth
        </button>
        <span className="wealth-nav-badge">GROWTH PROFILE SUMMARY</span>
        <button type="button" className="wealth-action-btn" onClick={() => navigate('/growth/assessment')}>
          Retake Assessment ✦
        </button>
      </div>

      {/* HEADER */}
      <div className="wealth-header">
        <div className="wealth-header-icon">⚙️</div>
        <div>
          <span className="eyebrow">YOUR PARAMETERS</span>
          <h1 className="wealth-title">Growth Profile & Configuration</h1>
          <p className="wealth-subtitle">
            Review your top strengths, calculated priorities, available growth time, and learning preferences.
          </p>
        </div>
      </div>

      {/* MAIN SUMMARY GRID */}
      <div className="wealth-grid-2" style={{ marginBottom: '32px' }}>
        {/* STRENGTHS & PRIORITIES */}
        <div className="budget-breakdown-section">
          <span className="eyebrow">DIAGNOSTICS</span>
          <h3 style={{ color: '#ffffff', fontSize: '20px', margin: '4px 0 16px 0' }}>Top Strengths & Priorities</h3>

          <div style={{ marginBottom: '20px' }}>
            <span className="metric-tag" style={{ color: '#10b981' }}>
              TOP STRENGTHS
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {profile.strengths?.map((s) => (
                <span key={s} className="badge-green">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="metric-tag" style={{ color: '#60a5fa' }}>
              CALCULATED PRIORITIES
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              {profile.priorities?.slice(0, 3).map((p, idx) => (
                <div key={idx} className="budget-bar-card">
                  <strong style={{ color: '#ffffff' }}>
                    #{idx + 1} {p.skill}
                  </strong>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                    Current: {p.currentLevel}/10 → Target: {p.targetLevel}/10
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TIME & PREFERENCES */}
        <div className="budget-breakdown-section">
          <span className="eyebrow">ALLOCATION</span>
          <h3 style={{ color: '#ffffff', fontSize: '20px', margin: '4px 0 16px 0' }}>Time & Preferences</h3>

          <div className="budget-bar-card" style={{ marginBottom: '16px' }}>
            <span className="metric-tag">DAILY TIME COMMITMENT</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
              ⏱️ {profile.availableTimeMinutes || 30} Minutes / Day
            </div>
          </div>

          <div className="budget-bar-card" style={{ marginBottom: '16px' }}>
            <span className="metric-tag">LIFE CONTEXT</span>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
              👤 {profile.currentContext || 'Student'}
            </div>
          </div>

          <div className="budget-bar-card">
            <span className="metric-tag">LEARNING PREFERENCES</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {profile.learningPreferences?.map((lp) => (
                <span key={lp} className="ideal-tag-badge">
                  {lp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
