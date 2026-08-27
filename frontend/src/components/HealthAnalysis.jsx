import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  HealthVisualIcon,
  BodyProfileIcon,
  SleepRecoveryIcon,
  ActivityIntensityIcon,
  DayProfileVisualIcon,
} from './AnimatedIcons';

export default function HealthAnalysis() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.getHealthAnalysis(token);
        console.log('HEALTH ANALYSIS RES:', res);

        if (res.success && res.data) {
          setAnalysis(res.data);
        } else {
          setError(res.message || 'Health profile not found. Please set up your health profile first.');
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Health profile not found.');
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [token]);

  if (loading) {
    return (
      <div className="wealth-page-container">
        <div className="analysis-loading">
          <div className="analysis-loader" />
          <p>Analyzing your sleep, BMI, and metabolic health parameters...</p>
        </div>
      </div>
    );
  }

  /* EMPTY STATE / MISSING PROFILE ERROR FIX */
  if (error || !analysis) {
    return (
      <div className="wealth-page-container">
        <div className="analysis-error-card">
          <div className="error-icon">🌿</div>
          <h2>Health Profile Setup Required</h2>
          <p>{error || 'You have not filled out your Health Profile yet. Complete your profile to view your personalized health analysis and lifestyle score.'}</p>
          <button
            type="button"
            className="health-submit-btn"
            onClick={() => navigate('/health')}
          >
            Set Up Health Profile Now →
          </button>
        </div>
      </div>
    );
  }

  const {
    healthScore = 78,
    category = 'Good',
    bmi,
    sleep,
    activity,
    summary,
    recommendations = [],
  } = analysis;

  const bmiVal = bmi?.value;
  const bmiProgress = bmiVal ? Math.min(100, (bmiVal / 40) * 100) : 0;

  const sleepMins = sleep?.totalMinutes;
  const sleepProgress = sleepMins ? Math.min(100, (sleepMins / 540) * 100) : 0;

  const getCategoryClass = (cat) => {
    if (cat === 'Optimal') return 'badge-green';
    if (cat === 'Good') return 'badge-emerald';
    if (cat === 'Fair') return 'badge-yellow';
    return 'badge-red';
  };

  return (
    <div className="wealth-page-container">
      {/* HEADER WITH SCORE GAUGE */}
      <header className="wealth-analysis-header health-banner-glow">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          <HealthVisualIcon size={46} />
          <div className="header-left">
            <span className="eyebrow health-eyebrow">HEALTHMARGDARSHI · LIFESTYLE ANALYSIS</span>
            <h1>Your Health & Vitality Snapshot</h1>
            <p>
              Real-time assessment of your Body Mass Index (BMI), recovery sleep quality, daily movement intensity, and metabolic rhythm.
            </p>
          </div>
        </div>

        {/* HEALTH SCORE GAUGE CARD */}
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
                  strokeDashoffset: 264 - (264 * healthScore) / 100,
                }}
              />
            </svg>
            <div className="score-display">
              <span className="score-num">{healthScore}</span>
              <span className="score-max">/100</span>
            </div>
          </div>

          <div className="score-meta">
            <span className="score-label">Lifestyle Score</span>
            <span className={`score-category ${getCategoryClass(category)}`}>
              ● {category}
            </span>
          </div>
        </div>
      </header>

      {/* 4 CORE HEALTH METRIC CARDS */}
      <div className="wealth-metrics-grid">
        {/* CARD 1: BMI */}
        <div className="wealth-metric-card">
          <div className="metric-header">
            <BodyProfileIcon size={24} />
            <span className="metric-tag">BODY PROFILE</span>
          </div>
          <h3 className="metric-title">Body Mass Index (BMI)</h3>
          <div className="metric-value text-accent">
            {bmiVal ?? '--'}
          </div>
          <div className="metric-subtext">
            {bmi?.category || 'Informational screening metric'}
          </div>
          <div className="metric-bar-bg">
            <div
              className="metric-bar-fill bg-accent"
              style={{ width: `${bmiProgress}%` }}
            />
          </div>
        </div>

        {/* CARD 2: SLEEP DURATION */}
        <div className="wealth-metric-card">
          <div className="metric-header">
            <SleepRecoveryIcon size={24} />
            <span className="metric-tag">RECOVERY</span>
          </div>
          <h3 className="metric-title">Nightly Sleep Duration</h3>
          <div className="metric-value text-emerald">
            {sleep?.duration || '--'}
          </div>
          <div className="metric-subtext">
            {sleep?.status ? `Status: ${sleep.status}` : 'Ideal: 7 to 9 hours'}
          </div>
          <div className="metric-bar-bg">
            <div
              className="metric-bar-fill bg-emerald"
              style={{ width: `${sleepProgress}%` }}
            />
          </div>
        </div>

        {/* CARD 3: ACTIVITY LEVEL */}
        <div className="wealth-metric-card">
          <div className="metric-header">
            <ActivityIntensityIcon size={24} />
            <span className="metric-tag">MOVEMENT</span>
          </div>
          <h3 className="metric-title">Activity Intensity</h3>
          <div className="metric-value text-warning">
            {activity?.level || '--'}
          </div>
          <div className="metric-subtext">
            Exercise: {activity?.exercise || 'Not specified'}
          </div>
          <div className="metric-bar-bg">
            <div
              className="metric-bar-fill bg-warning"
              style={{
                width:
                  String(activity?.level).toLowerCase().includes('high')
                    ? '90%'
                    : String(activity?.level).toLowerCase().includes('moderate')
                    ? '65%'
                    : '35%',
              }}
            />
          </div>
        </div>

        {/* CARD 4: CIRCADIAN WINDOW */}
        <div className="wealth-metric-card">
          <div className="metric-header">
            <DayProfileVisualIcon size={24} />
            <span className="metric-tag">RHYTHM</span>
          </div>
          <h3 className="metric-title">Sleep-Wake Schedule</h3>
          <div className="metric-value text-positive">
            {summary?.sleepTime && summary?.wakeTime ? `${summary.sleepTime} - ${summary.wakeTime}` : '--'}
          </div>
          <div className="metric-subtext">
            Work / College: {summary?.collegeWorkTiming || 'Not specified'}
          </div>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill bg-positive" style={{ width: '80%' }} />
          </div>
        </div>
      </div>

      {/* LIFESTYLE BALANCE VISUALIZER */}
      <section className="budget-breakdown-section">
        <div className="section-header">
          <div>
            <span className="eyebrow health-eyebrow">CIRCADIAN OPTIMIZATION</span>
            <h2>Daily 24-Hour Rhythm & Balance</h2>
            <p>Visualizing your 24-hour balance across Sleep Rest, Physical Movement, and Work/Study commitments.</p>
          </div>
        </div>

        <div className="budget-bars-grid">
          {/* SLEEP REST */}
          <div className="budget-bar-card">
            <div className="bar-card-header">
              <span className="bar-title">Rest & Sleep Recovery</span>
              <span className="bar-values">
                {sleep?.hours ? `${sleep.hours}h ${sleep.minutes}m` : '7h 30m'} <small>(Target: 8.0h)</small>
              </span>
            </div>
            <div className="budget-track">
              <div className="budget-fill fill-savings" style={{ width: `${sleepProgress}%` }} />
            </div>
            <p className="bar-desc">Bedtime: {summary?.sleepTime || '23:00'} | Wakeup: {summary?.wakeTime || '07:00'}</p>
          </div>

          {/* PHYSICAL MOVEMENT */}
          <div className="budget-bar-card">
            <div className="bar-card-header">
              <span className="bar-title">Daily Movement & Exercise</span>
              <span className="bar-values">
                {activity?.level || 'Moderate'} <small>(Active exercise)</small>
              </span>
            </div>
            <div className="budget-track">
              <div
                className="budget-fill fill-needs"
                style={{
                  width: String(activity?.level).toLowerCase().includes('high')
                    ? '85%'
                    : '60%',
                }}
              />
            </div>
            <p className="bar-desc">Routine: {activity?.exercise || summary?.exercise || 'Regular daily movement'}</p>
          </div>

          {/* WORK / STUDY WINDOW */}
          <div className="budget-bar-card">
            <div className="bar-card-header">
              <span className="bar-title">Work / College Window</span>
              <span className="bar-values">{summary?.collegeWorkTiming || '09:00 - 17:00'}</span>
            </div>
            <div className="budget-track">
              <div className="budget-fill fill-wants" style={{ width: '70%' }} />
            </div>
            <p className="bar-desc">Active study / office focus hours</p>
          </div>
        </div>
      </section>

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <section className="wealth-recommendations-section">
          <div className="section-header">
            <span className="eyebrow health-eyebrow">HEALTH INSIGHTS</span>
            <h2>Personalized Wellness Guidance</h2>
          </div>

          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={index} className={`recommendation-item rec-${rec.type}`}>
                <div className="rec-icon">
                  {rec.type === 'warning' ? '⚠️' : rec.type === 'success' ? '✨' : '💡'}
                </div>
                <div className="rec-content">
                  <h4>{rec.title}</h4>
                  <p>{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* QUICK PROFILE SUMMARY */}
      <section className="allocation-card" style={{ marginBottom: '32px' }}>
        <div className="card-top-head">
          <span className="icon">📋</span>
          <h3>Your Health Profile Parameters</h3>
        </div>
        <p className="card-subtext">The biometrics currently saved in your profile.</p>

        <div className="wealth-grid-3">
          <div className="summary-item">
            <span className="target-label">Age</span>
            <strong className="target-val">{summary?.age ? `${summary.age} yrs` : '--'}</strong>
          </div>
          <div className="summary-item">
            <span className="target-label">Height</span>
            <strong className="target-val">{summary?.height ? `${summary.height} cm` : '--'}</strong>
          </div>
          <div className="summary-item">
            <span className="target-label">Weight</span>
            <strong className="target-val">{summary?.weight ? `${summary.weight} kg` : '--'}</strong>
          </div>
          <div className="summary-item">
            <span className="target-label">Food Preference</span>
            <strong className="target-val">{summary?.foodPreference || '--'}</strong>
          </div>
          <div className="summary-item">
            <span className="target-label">Work / College</span>
            <strong className="target-val">{summary?.collegeWorkTiming || '--'}</strong>
          </div>
          <div className="summary-item">
            <span className="target-label">Health Notes</span>
            <strong className="target-val">{summary?.healthConditions || 'None'}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}