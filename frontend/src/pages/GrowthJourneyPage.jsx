import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGrowthProfile } from '../services/growthService';

export default function GrowthJourneyPage() {
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
        console.error('Fetch journey error:', err);
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
          <strong>Loading your growth journey...</strong>
        </div>
      </div>
    );
  }

  const milestones = [
    { title: 'Completed Growth Assessment', status: 'Completed', date: 'Day 1', icon: '✓' },
    { title: 'Calculated 12-Month Personalized Roadmap', status: 'Completed', date: 'Day 1', icon: '✓' },
    { title: 'First Daily Action Challenge Completed', status: profile?.daysActive > 1 ? 'Completed' : 'Active', date: 'Week 1', icon: '✦' },
    { title: '7-Day Consistency Streak', status: profile?.activeStreak >= 7 ? 'Completed' : 'In Progress', date: 'Week 2', icon: '🔥' },
    { title: 'Month 1 Curriculum Completed', status: 'Upcoming', date: 'Month 1', icon: '◇' },
    { title: 'Stage Level Up: Building → Growing', status: 'Upcoming', date: 'Month 3', icon: '🏆' },
  ];

  return (
    <div className="wealth-page-container">
      {/* TOP NAV BAR */}
      <div className="wealth-top-nav">
        <button type="button" className="wealth-back-btn" onClick={() => navigate('/growth')}>
          ← Back to Growth
        </button>
        <span className="wealth-nav-badge">GROWTH JOURNEY TIMELINE</span>
        <button type="button" className="wealth-secondary-btn" onClick={() => navigate('/growth/profile')}>
          Growth Profile
        </button>
      </div>

      {/* HEADER */}
      <div className="wealth-header">
        <div className="wealth-header-icon">🚀</div>
        <div>
          <span className="eyebrow">DEVELOPMENT TIMELINE</span>
          <h1 className="wealth-title">Your Ascending Growth Journey</h1>
          <p className="wealth-subtitle">
            Track completed milestones, continuous streaks, and key level achievements over time.
          </p>
        </div>
      </div>

      {/* STAGE & MILESTONES TIMELINE */}
      <div className="budget-breakdown-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">MILESTONE TRACKER</span>
            <h2>Development Path</h2>
          </div>
          <span className="focus-pill">Current Stage: {profile?.growthStage || 'Building'}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="budget-bar-card"
              style={{
                borderColor: m.status === 'Completed' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                background: m.status === 'Completed' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.6)',
              }}
            >
              <div className="bar-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: m.status === 'Completed' ? '#10b981' : 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                    }}
                  >
                    {m.icon}
                  </span>
                  <div>
                    <strong className="bar-title">{m.title}</strong>
                    <span style={{ display: 'block', fontSize: '12px', color: '#6b7280' }}>Timeline: {m.date}</span>
                  </div>
                </div>
                <span className={m.status === 'Completed' ? 'badge-green' : 'ideal-tag-badge'}>{m.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
