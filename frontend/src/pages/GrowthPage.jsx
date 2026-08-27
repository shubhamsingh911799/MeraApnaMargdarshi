import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGrowthProfile, completeGrowthTask } from '../services/growthService';
import { GrowthVisualIcon } from '../components/AnimatedIcons';

export default function GrowthPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [taskCompleting, setTaskCompleting] = useState(false);
  const [taskSuccessMsg, setTaskSuccessMsg] = useState('');

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
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('Fetch growth profile error:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleCompleteTask = async (taskId) => {
    if (!taskId || taskCompleting) return;
    try {
      setTaskCompleting(true);
      const res = await completeGrowthTask(taskId, token);
      if (res.success && res.data?.growthProfile) {
        setProfile(res.data.growthProfile);
        setTaskSuccessMsg('✓ Task completed! Growth score updated.');
        setTimeout(() => setTaskSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Complete task error:', err);
    } finally {
      setTaskCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="wealth-page-container">
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9ca3af' }}>
          <div className="day-profile-loader" style={{ margin: '0 auto 16px auto' }} />
          <strong>Understanding your growth profile...</strong>
          <p>Preparing your personalized daily actions and roadmap...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     EMPTY STATE — NO PROFILE YET
  ========================================================= */
  if (!profile) {
    return (
      <div className="wealth-page-container">
        {/* TOP NAV BAR */}
        <div className="wealth-top-nav">
          <button type="button" className="wealth-back-btn" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
          <span className="wealth-nav-badge">GROWTHMARGDARSHI · PERSONAL DEVELOPMENT</span>
        </div>

        {/* HERO INTRO BANNER */}
        <header className="wealth-plan-header health-banner-glow">
          <GrowthVisualIcon size={46} />
          <div className="plan-header-main">
            <span className="eyebrow health-eyebrow">GROWTHMARGDARSHI · LIFE-SKILLS ENGINE</span>
            <h1>Welcome to GrowthMargdarshi</h1>
            <p>
              Your personal development and life-skills guide. Understand your current skill baseline, calculate top priority areas, build a 12-month adaptive roadmap, and practice small daily actions.
            </p>
          </div>
        </header>

        {/* 4 FEATURE HIGHLIGHT CARDS */}
        <div className="wealth-metrics-grid" style={{ marginBottom: '32px' }}>
          <div className="wealth-metric-card">
            <div className="metric-header">
              <span className="metric-icon">🎯</span>
              <span className="metric-tag">STEP 1</span>
            </div>
            <p className="metric-title">6-Step Assessment</p>
            <div className="metric-subtext" style={{ color: '#d1d5db', fontSize: '13px', lineHeight: '1.5' }}>
              Rate 12 core life skills (Communication, Confidence, Focus, Time Management, Discipline).
            </div>
          </div>

          <div className="wealth-metric-card">
            <div className="metric-header">
              <span className="metric-icon">🗺️</span>
              <span className="metric-tag">STEP 2</span>
            </div>
            <p className="metric-title">12-Month Roadmap</p>
            <div className="metric-subtext" style={{ color: '#d1d5db', fontSize: '13px', lineHeight: '1.5' }}>
              Dynamic curriculum with monthly goals, supporting habits, and weekly focus topics.
            </div>
          </div>

          <div className="wealth-metric-card">
            <div className="metric-header">
              <span className="metric-icon">⚡</span>
              <span className="metric-tag">STEP 3</span>
            </div>
            <p className="metric-title">Daily Actions</p>
            <div className="metric-subtext" style={{ color: '#d1d5db', fontSize: '13px', lineHeight: '1.5' }}>
              Small 15–30 min actionable tasks designed around your actual daily available time.
            </div>
          </div>

          <div className="wealth-metric-card">
            <div className="metric-header">
              <span className="metric-icon">✍️</span>
              <span className="metric-tag">STEP 4</span>
            </div>
            <p className="metric-title">Adaptive Reflections</p>
            <div className="metric-subtext" style={{ color: '#d1d5db', fontSize: '13px', lineHeight: '1.5' }}>
              Weekly self-reflections that dynamically adjust difficulty and task volume over time.
            </div>
          </div>
        </div>

        {/* CTA CARD */}
        <div className="wealth-plan-cta-box">
          <div className="cta-left">
            <span className="cta-sparkle">🌱</span>
            <div>
              <h3 style={{ color: '#ffffff', margin: '0 0 4px 0', fontSize: '20px', fontWeight: 800 }}>
                Ready to Build Your Growth Profile?
              </h3>
              <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>
                Takes only 2 minutes. We will calculate your top priority skills and generate your custom 12-month curriculum.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="wealth-action-btn"
            style={{ padding: '14px 32px', fontSize: '16px' }}
            onClick={() => navigate('/growth/assessment')}
          >
            Build My Growth Profile ✦
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN DASHBOARD
  ========================================================= */

  const topPriority = profile.priorities?.[0] || {
    skill: 'Confidence',
    currentLevel: 4,
    targetLevel: 7,
    reason: 'Building confidence will support your communication and public-speaking goals.',
  };

  const todayTask = profile.dailyTasks?.[profile.dailyTasks.length - 1] || {
    _id: 'sample',
    title: 'Speak for 2 minutes about any topic without preparing beforehand.',
    durationMinutes: profile.availableTimeMinutes || 15,
    skill: topPriority.skill,
    difficulty: 'Easy',
    completed: false,
  };

  const activeMonth = profile.roadmap?.[0] || {
    month: 1,
    title: 'Self-awareness & Baseline',
    objective: 'Understand current habits, triggers, and baseline strengths.',
  };

  const handleResetGrowth = async () => {
    if (window.confirm("Are you sure you want to reset your Growth Profile? This will reset your 12-month skill roadmap and allow you to re-take the 6-step assessment.")) {
      try {
        setLoading(true);
        await api.resetGrowthProfile(token);
        setProfile(null);
      } catch (err) {
        console.error('Reset Growth Profile error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="wealth-page-container">
      {/* TOP NAV BAR */}
      <div className="wealth-top-nav">
        <button type="button" className="wealth-back-btn" onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>

        <div className="wealth-nav-right">
          <button type="button" className="wealth-secondary-btn" onClick={() => navigate('/growth/assessment')}>
            ✏️ Re-take Assessment
          </button>
          <button
            type="button"
            className="wealth-secondary-btn"
            style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
            onClick={handleResetGrowth}
          >
            🔄 Reset Growth Data
          </button>
          <button type="button" className="wealth-secondary-btn" onClick={() => navigate('/growth/roadmap')}>
            Roadmap
          </button>
          <button type="button" className="wealth-secondary-btn" onClick={() => navigate('/growth/journey')}>
            Journey
          </button>
          <button type="button" className="wealth-secondary-btn" onClick={() => navigate('/growth/profile')}>
            Profile
          </button>
          <button type="button" className="wealth-action-btn" onClick={() => navigate('/growth/reflection')}>
            Reflect
          </button>
        </div>
      </div>

      {/* HERO GREETING */}
      <div className="wealth-header">
        <GrowthVisualIcon size={46} />
        <div>
          <span className="eyebrow">GROWTHMARGDARSHI</span>
          <h1 className="wealth-title">Good morning, {user?.name || 'Friend'}.</h1>
          <p className="wealth-subtitle">
            Your growth doesn't need to happen all at once. Focus on the next right step.
          </p>
        </div>
      </div>

      {/* OVERVIEW STATS CARDS */}
      <div className="wealth-metrics-grid">
        <div className="wealth-metric-card">
          <div className="metric-header">
            <span className="metric-icon">📈</span>
            <span className="metric-tag">OVERALL SCORE</span>
          </div>
          <p className="metric-title">Overall Growth</p>
          <div className="metric-value text-emerald">{profile.overallScore || 42}%</div>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill bg-emerald" style={{ width: `${profile.overallScore || 42}%` }} />
          </div>
        </div>

        <div className="wealth-metric-card">
          <div className="metric-header">
            <span className="metric-icon">🏆</span>
            <span className="metric-tag">CURRENT STAGE</span>
          </div>
          <p className="metric-title">Stage</p>
          <div className="metric-value text-accent">{profile.growthStage || 'Building'}</div>
          <div className="metric-subtext">Level 2 of 6</div>
        </div>

        <div className="wealth-metric-card">
          <div className="metric-header">
            <span className="metric-icon">📅</span>
            <span className="metric-tag">ACTIVE DAYS</span>
          </div>
          <p className="metric-title">Days Active</p>
          <div className="metric-value text-warning">{profile.daysActive || 1}</div>
          <div className="metric-subtext">Total active days</div>
        </div>

        <div className="wealth-metric-card">
          <div className="metric-header">
            <span className="metric-icon">🔥</span>
            <span className="metric-tag">STREAK</span>
          </div>
          <p className="metric-title">Current Streak</p>
          <div className="metric-value text-emerald">{profile.activeStreak || 1} Days</div>
          <div className="metric-subtext">Active daily streak</div>
        </div>
      </div>

      {/* CURRENT FOCUS CARD */}
      <div className="wealth-form-section" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span className="eyebrow">YOUR CURRENT FOCUS</span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '4px 0 8px 0' }}>
              {topPriority.skill}
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, maxWidth: '650px' }}>
              {topPriority.reason}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="score-label">Current Level</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#34d399' }}>
              {topPriority.currentLevel || 4} / 10 → Target {topPriority.targetLevel || 7}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="focus-pill">This month's focus: Practice and initiative</div>
          <button type="button" className="wealth-secondary-btn" onClick={() => navigate('/growth/roadmap')}>
            View Focus Plan →
          </button>
        </div>
      </div>

      {/* TODAY'S GROWTH ACTION CARD */}
      <div className="budget-breakdown-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">DAILY ACTION</span>
            <h2>Today's Growth Action</h2>
            <p>The smallest useful action you can take today.</p>
          </div>
          <span className="ideal-tag-badge">⏱️ {todayTask.durationMinutes} minutes</span>
        </div>

        {taskSuccessMsg && (
          <div className="wealth-alert wealth-alert-success">
            <span>{taskSuccessMsg}</span>
          </div>
        )}

        <div className="budget-bar-card">
          <div className="bar-card-header">
            <div>
              <span className="metric-tag" style={{ color: '#10b981', marginRight: '8px' }}>
                [{todayTask.type || 'Practice'}]
              </span>
              <strong className="bar-title">{todayTask.title}</strong>
            </div>
            <span className="badge-green">{todayTask.difficulty || 'Easy'}</span>
          </div>
          <p className="bar-desc" style={{ fontSize: '14px', margin: '8px 0 16px 0', color: '#d1d5db' }}>
            {todayTask.description}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Skill: {todayTask.skill}</span>
            <button
              type="button"
              className={todayTask.completed ? 'wealth-secondary-btn' : 'wealth-action-btn'}
              onClick={() => handleCompleteTask(todayTask._id)}
              disabled={todayTask.completed || taskCompleting}
            >
              {todayTask.completed ? '✓ Completed' : taskCompleting ? 'Saving...' : 'Mark Complete'}
            </button>
          </div>
        </div>
      </div>

      {/* SKILL OVERVIEW VISUALIZER */}
      <div className="budget-breakdown-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">SKILL VISUALIZATION</span>
            <h2>10-Skill Matrix</h2>
            <p>Self-rated baseline progress across core life skills.</p>
          </div>
        </div>

        <div className="wealth-grid-2">
          {Object.entries(profile.skillRatings || {}).map(([key, rating]) => {
            const skillName = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
            return (
              <div key={key} className="budget-bar-card">
                <div className="bar-card-header">
                  <span className="bar-title">{skillName}</span>
                  <span className="bar-values">{rating} / 10</span>
                </div>
                <div className="budget-track">
                  <div
                    className="budget-fill fill-savings"
                    style={{ width: `${(rating / 10) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 12-MONTH ROADMAP PREVIEW */}
      <div className="roadmap-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">CURRICULUM</span>
            <h2>Active 12-Month Roadmap</h2>
            <p>Month {activeMonth.month}: {activeMonth.title}</p>
          </div>
          <button type="button" className="wealth-secondary-btn" onClick={() => navigate('/growth/roadmap')}>
            Full Roadmap →
          </button>
        </div>

        <div className="month-details-panel">
          <div className="panel-header">
            <div>
              <span className="month-badge">MONTH {activeMonth.month}</span>
              <h3>{activeMonth.title}</h3>
            </div>
            <span className="focus-pill">{activeMonth.skills?.[0] || 'Core Skill'}</span>
          </div>

          <div className="objective-box">{activeMonth.objective}</div>
          <p className="bar-desc">Target: {activeMonth.target || 'Complete daily actions.'}</p>
        </div>
      </div>
    </div>
  );
}
