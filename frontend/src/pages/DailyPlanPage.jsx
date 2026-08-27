import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTodayPlan, toggleTask } from '../services/dailyPlanService';
import { DailyPlanVisualIcon } from '../components/AnimatedIcons';

export default function DailyPlanPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    loadPlan();
  }, [token]);

  const loadPlan = async () => {
    try {
      setLoading(true);
      const response = await getTodayPlan(token);
      console.log('TODAY PLAN:', response);

      const p = response.dailyPlan || response.plan || response.data || response;
      setPlan(p);
    } catch (error) {
      console.error('PLAN LOAD ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (taskId, currentCompleted) => {
    if (!plan?._id || togglingId) return;

    try {
      setTogglingId(taskId);
      await toggleTask(plan._id, taskId, !currentCompleted, token);
      await loadPlan();
    } catch (error) {
      console.error('TASK UPDATE ERROR:', error);
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div className="wealth-page-container">
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9ca3af' }}>
          <div className="day-profile-loader" style={{ margin: '0 auto 16px auto' }} />
          <strong>Loading today's personalized plan & analytics...</strong>
        </div>
      </div>
    );
  }

  if (!plan || !plan.tasks) {
    return (
      <div className="wealth-page-container">
        <div className="wealth-top-nav">
          <button type="button" className="wealth-back-btn" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>

        <div className="analysis-error-card">
          <div className="error-icon">📋</div>
          <h2>No Daily Plan Generated Today</h2>
          <p>Please set up your Day Profile first so we can build your custom day-to-day routine plan.</p>
          <button type="button" className="wealth-action-btn" onClick={() => navigate('/day-profile')}>
            Set Up Day Profile Now →
          </button>
        </div>
      </div>
    );
  }

  const tasks = plan.tasks || [];
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const pendingCount = totalCount - completedCount;

  // Domain categorization helper
  const getDomainIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('water') || t.includes('steps') || t.includes('workout') || t.includes('sleep') || t.includes('health')) return '🌿';
    if (t.includes('expenses') || t.includes('budget') || t.includes('save') || t.includes('money')) return '💰';
    if (t.includes('code') || t.includes('read') || t.includes('study') || t.includes('focus') || t.includes('learn')) return '🎯';
    return '✦';
  };

  return (
    <div className="wealth-page-container">
      {/* TOP NAVIGATION BAR */}
      <div className="wealth-top-nav">
        <button type="button" className="wealth-back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        <div className="wealth-nav-right">
          <button type="button" className="wealth-secondary-btn" onClick={() => navigate('/day-profile')}>
            ✏️ Edit Day Profile
          </button>
          <button type="button" className="wealth-secondary-btn" onClick={loadPlan}>
            🔄 Refresh Plan
          </button>
        </div>
      </div>

      {/* HERO HEADER WITH SCORE DONUT GAUGE */}
      <header className="wealth-analysis-header health-banner-glow">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          <DailyPlanVisualIcon size={46} />
          <div className="header-left">
            <span className="eyebrow health-eyebrow">DAILYMARGDARSHI · TODAY'S EXECUTION PLAN</span>
            <h1>Today's Plan & Execution Analytics</h1>
            <p>
              Your AI-orchestrated daily routine. Check off tasks as you complete them to increase your daily execution score.
            </p>
          </div>
        </div>

        {/* COMPLETION DONUT GAUGE */}
        <div className="health-score-card">
          <div className="score-ring-container">
            <svg className="score-ring" viewBox="0 0 100 100">
              <circle className="ring-bg" cx="50" cy="50" r="42" />
              <circle
                className="ring-progress health-ring-fill"
                cx="50"
                cy="50"
                r="42"
                style={{
                  strokeDasharray: 264,
                  strokeDashoffset: 264 - (264 * completionPercentage) / 100,
                  stroke: completionPercentage >= 80 ? '#10b981' : completionPercentage >= 40 ? '#fbbf24' : '#ff4d6d',
                }}
              />
            </svg>
            <div className="score-display">
              <span className="score-num">{completionPercentage}%</span>
            </div>
          </div>

          <div className="score-meta">
            <span className="score-label">Plan Execution</span>
            <span
              className={`score-category ${
                completionPercentage >= 80 ? 'badge-green' : completionPercentage >= 40 ? 'badge-yellow' : 'badge-red'
              }`}
            >
              {completedCount} / {totalCount} Completed
            </span>
          </div>
        </div>
      </header>

      {/* 4 CORE ANALYTICS METRICS CARDS */}
      <div className="wealth-metrics-grid">
        <div className="wealth-metric-card">
          <div className="metric-header">
            <span className="metric-icon">📋</span>
            <span className="metric-tag">TOTAL TASKS</span>
          </div>
          <p className="metric-title">Daily Actions</p>
          <div className="metric-value text-accent">{totalCount} Tasks</div>
          <div className="metric-subtext">Scheduled for today</div>
        </div>

        <div className="wealth-metric-card">
          <div className="metric-header">
            <span className="metric-icon">✓</span>
            <span className="metric-tag">COMPLETED</span>
          </div>
          <p className="metric-title">Done Today</p>
          <div className="metric-value text-emerald">{completedCount} Completed</div>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill bg-emerald" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>

        <div className="wealth-metric-card">
          <div className="metric-header">
            <span className="metric-icon">⏳</span>
            <span className="metric-tag">REMAINING</span>
          </div>
          <p className="metric-title">Pending Tasks</p>
          <div className="metric-value text-warning">{pendingCount} Remaining</div>
          <div className="metric-subtext">To be completed</div>
        </div>

        <div className="wealth-metric-card">
          <div className="metric-header">
            <span className="metric-icon">🔥</span>
            <span className="metric-tag">DAY FOCUS</span>
          </div>
          <p className="metric-title">Efficiency Index</p>
          <div className="metric-value text-positive">{completionPercentage >= 50 ? 'High' : 'Building'}</div>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill bg-positive" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>
      </div>

      {/* GRAPHICAL DISTRIBUTION ANALYTICS SECTION */}
      <section className="budget-breakdown-section">
        <div className="section-header">
          <div>
            <span className="eyebrow health-eyebrow">DOMAIN ANALYTICS</span>
            <h2>Task Category Distribution</h2>
            <p>Visualizing today's tasks across Health, Wealth, Productivity, and Personal Development.</p>
          </div>
        </div>

        <div className="wealth-grid-3">
          <div className="budget-bar-card">
            <div className="bar-card-header">
              <span className="bar-title">🌿 Health & Wellness</span>
              <span className="bar-values">
                {tasks.filter((t) => getDomainIcon(t.title) === '🌿').length} Tasks
              </span>
            </div>
            <div className="budget-track">
              <div
                className="budget-fill fill-savings"
                style={{
                  width: `${(tasks.filter((t) => getDomainIcon(t.title) === '🌿').length / totalCount) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="budget-bar-card">
            <div className="bar-card-header">
              <span className="bar-title">💰 Wealth & Finances</span>
              <span className="bar-values">
                {tasks.filter((t) => getDomainIcon(t.title) === '💰').length} Tasks
              </span>
            </div>
            <div className="budget-track">
              <div
                className="budget-fill fill-needs"
                style={{
                  width: `${(tasks.filter((t) => getDomainIcon(t.title) === '💰').length / totalCount) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="budget-bar-card">
            <div className="bar-card-header">
              <span className="bar-title">🎯 Focus & Growth</span>
              <span className="bar-values">
                {tasks.filter((t) => getDomainIcon(t.title) === '🎯' || getDomainIcon(t.title) === '✦').length} Tasks
              </span>
            </div>
            <div className="budget-track">
              <div
                className="budget-fill fill-wants"
                style={{
                  width: `${
                    (tasks.filter((t) => getDomainIcon(t.title) === '🎯' || getDomainIcon(t.title) === '✦').length /
                      totalCount) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* TODAY'S INTERACTIVE TASK LIST */}
      <section className="budget-breakdown-section">
        <div className="section-header">
          <div>
            <span className="eyebrow health-eyebrow">ACTION CHECKLIST</span>
            <h2>Today's Checklist Items</h2>
            <p>Click any task to toggle completion state in real time.</p>
          </div>
          <span className="focus-pill">{completedCount} of {totalCount} Done</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tasks.map((task) => {
            const icon = getDomainIcon(task.title);
            const isToggling = togglingId === task._id;

            return (
              <div
                key={task._id}
                onClick={() => handleToggle(task._id, task.completed)}
                className="budget-bar-card"
                style={{
                  cursor: 'pointer',
                  borderColor: task.completed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                  background: task.completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(12, 10, 15, 0.8)',
                  opacity: isToggling ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '8px',
                      border: task.completed ? '2px solid #10b981' : '2px solid rgba(255,255,255,0.3)',
                      background: task.completed ? '#10b981' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '14px',
                    }}
                  >
                    {task.completed ? '✓' : ''}
                  </div>

                  <div>
                    <span style={{ fontSize: '18px', marginRight: '8px' }}>{icon}</span>
                    <strong
                      style={{
                        fontSize: '16px',
                        color: task.completed ? '#9ca3af' : '#ffffff',
                        textDecoration: task.completed ? 'line-through' : 'none',
                      }}
                    >
                      {task.title}
                    </strong>
                  </div>
                </div>

                <span className={task.completed ? 'badge-green' : 'ideal-tag-badge'}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}