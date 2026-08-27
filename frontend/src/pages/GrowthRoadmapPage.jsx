import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGrowthProfile } from '../services/growthService';

export default function GrowthRoadmapPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(1);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const res = await getGrowthProfile(token);
        if (res.success && res.data?.growthProfile?.roadmap) {
          setRoadmap(res.data.growthProfile.roadmap);
        }
      } catch (err) {
        console.error('Fetch roadmap error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [token]);

  if (loading) {
    return (
      <div className="wealth-page-container">
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9ca3af' }}>
          <div className="day-profile-loader" style={{ margin: '0 auto 16px auto' }} />
          <strong>Generating your 12-month curriculum...</strong>
        </div>
      </div>
    );
  }

  const activeData = roadmap.find((m) => m.month === selectedMonth) || roadmap[0] || {
    month: 1,
    title: 'Self-awareness & Baseline',
    objective: 'Understand current habits, triggers, and baseline strengths.',
    primaryGoal: 'Establish daily self-monitoring and baseline clarity.',
    supportingGoals: ['Identify daily distraction patterns', 'Log daily mood & focus window'],
    target: 'Complete 15 daily reflections this month.',
    weeks: [1, 2, 3, 4].map((w) => ({
      week: w,
      title: `Week ${w}: Baseline Focus`,
      objective: `Level ${w} reflection and practice exercises.`,
    })),
  };

  return (
    <div className="wealth-page-container">
      {/* TOP NAV BAR */}
      <div className="wealth-top-nav">
        <button type="button" className="wealth-back-btn" onClick={() => navigate('/growth')}>
          ← Back to Growth
        </button>
        <span className="wealth-nav-badge">12-MONTH PERSONAL ROADMAP</span>
        <button type="button" className="wealth-action-btn" onClick={() => navigate('/growth/journey')}>
          View Journey →
        </button>
      </div>

      {/* HEADER */}
      <div className="wealth-header">
        <div className="wealth-header-icon">🗺️</div>
        <div>
          <span className="eyebrow">PERSONAL CURRICULUM</span>
          <h1 className="wealth-title">Your 12-Month Development Roadmap</h1>
          <p className="wealth-subtitle">
            A step-by-step master plan calculated from your baseline skill ratings, priorities, and goals.
          </p>
        </div>
      </div>

      {/* MONTH TABS SCROLLER */}
      <div className="month-tabs-scroller">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <button
            key={m}
            type="button"
            className={`month-tab-btn ${selectedMonth === m ? 'active' : ''}`}
            onClick={() => setSelectedMonth(m)}
          >
            <span className="m-num">Month {m}</span>
            <span className="m-focus">
              {roadmap.find((rm) => rm.month === m)?.title.split(' ')[0] || `Level ${m}`}
            </span>
          </button>
        ))}
      </div>

      {/* MONTH DETAILS PANEL */}
      <div className="month-details-panel" style={{ marginBottom: '32px' }}>
        <div className="panel-header">
          <div>
            <span className="month-badge">MONTH {activeData.month} OF 12</span>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', margin: '4px 0 0 0' }}>
              {activeData.title}
            </h2>
          </div>
          <span className="focus-pill">{activeData.skills?.[0] || 'Focus Area'}</span>
        </div>

        <div className="objective-box" style={{ marginTop: '16px' }}>
          <strong>Objective:</strong> {activeData.objective}
        </div>

        {/* GOALS */}
        <div className="wealth-grid-2" style={{ marginTop: '24px' }}>
          <div className="budget-bar-card">
            <span className="metric-tag" style={{ color: '#10b981' }}>
              PRIMARY GOAL
            </span>
            <h4 style={{ color: '#ffffff', margin: '8px 0', fontSize: '16px' }}>{activeData.primaryGoal}</h4>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Target: {activeData.target}</p>
          </div>

          <div className="budget-bar-card">
            <span className="metric-tag" style={{ color: '#60a5fa' }}>
              SUPPORTING MILESTONES
            </span>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', color: '#d1d5db', fontSize: '14px' }}>
              {activeData.supportingGoals?.map((sg, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>
                  {sg}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* WEEKLY BREAKDOWN */}
        <div style={{ marginTop: '32px' }}>
          <h3 className="milestones-heading">Weekly Focus Topics</h3>
          <div className="milestones-grid">
            {activeData.weeks?.map((w) => (
              <div key={w.week} className="milestone-card">
                <span className="ms-check-icon">W{w.week}</span>
                <div>
                  <h5>{w.title}</h5>
                  <p>{w.objective}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
