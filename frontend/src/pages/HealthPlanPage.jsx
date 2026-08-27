import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateHealthPlan, getHealthPlan } from '../services/healthService';
import { HealthVisualIcon, ActivityIntensityIcon } from '../components/AnimatedIcons';

export default function HealthPlanPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [healthPlan, setHealthPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(1);

  // =========================================================
  // LOAD EXISTING HEALTH PLAN
  // =========================================================

  useEffect(() => {
    const loadPlan = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError('');
        const res = await getHealthPlan(token);
        console.log('HEALTH PLAN FETCH RES:', res);

        if (res.success && res.data) {
          setHealthPlan(res.data);
        } else {
          handleGeneratePlan();
        }
      } catch (err) {
        console.error('LOAD HEALTH PLAN ERROR:', err);
        handleGeneratePlan();
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [token]);

  // =========================================================
  // GENERATE HEALTH PLAN
  // =========================================================

  const handleGeneratePlan = async () => {
    if (!token || generating) return;

    try {
      setGenerating(true);
      setError('');
      console.log('CREATING PERSONALIZED HEALTH PLAN...');
      const res = await generateHealthPlan(token);
      console.log('GENERATED PLAN RES:', res);

      if (res.success && res.data) {
        setHealthPlan(res.data);
      } else {
        setError(res.message || 'Unable to generate health plan. Complete your health profile first.');
      }
    } catch (err) {
      console.error('GENERATE HEALTH PLAN ERROR:', err);
      setError(err.message || 'Complete your health profile first to generate your 12-month plan.');
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading || generating) {
    return (
      <div className="wealth-page-container">
        <div className="analysis-loading">
          <div className="analysis-loader" />
          <p>Generating your 12-month health & wellness journey roadmap...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // NO PLAN CREATED YET / MISSING PROFILE ERROR FIX
  // =========================================================

  if (!healthPlan || error) {
    return (
      <div className="wealth-page-container">
        <div className="wealth-top-nav">
          <button
            type="button"
            className="wealth-back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="analysis-error-card">
          <div className="error-icon">🌿</div>
          <h2>Personalized Health Journey</h2>
          <p>{error || 'Your health profile is ready. Generate your personalized 12-month roadmap based on your biometrics, routines, and wellness goals.'}</p>
          <div className="btn-row">
            <button
              type="button"
              className="health-submit-btn"
              onClick={handleGeneratePlan}
              disabled={generating}
            >
              {generating ? 'Creating your plan...' : 'Create My Health Plan →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // PLAN DATA DESTRUCTURING
  // =========================================================

  const progress = Math.min(Math.max(Number(healthPlan.overallProgress || 0), 0), 100);
  const currentMonth = Number(healthPlan.currentMonth || 1);
  const durationMonths = Number(healthPlan.durationMonths || 12);
  const goals = Array.isArray(healthPlan.goals) ? healthPlan.goals : [];
  const roadmap = Array.isArray(healthPlan.monthlyRoadmap) ? healthPlan.monthlyRoadmap : [];

  const activeMonthData = roadmap.find((m) => m.month === selectedMonth) || roadmap[0];

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
            onClick={() => navigate('/health-analysis')}
          >
            📊 Health Analysis
          </button>
          <button
            type="button"
            className="wealth-secondary-btn"
            onClick={handleGeneratePlan}
          >
            🔄 Regenerate Roadmap
          </button>
        </div>
      </div>

      {/* HEADER BANNER */}
      <header className="wealth-plan-header health-banner-glow">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          <HealthVisualIcon size={46} />
          <div className="plan-header-main">
            <span className="eyebrow health-eyebrow">HEALTHMARGDARSHI · 12-MONTH WELLNESS ROADMAP</span>
            <h1>{healthPlan.planTitle || 'Your Personalized Health Journey'}</h1>
            <p>
              A personalized roadmap built around your lifestyle, body metrics, daily routines, and long-term vitality goals.
            </p>
          </div>
        </div>

        {/* TARGET HIGHLIGHT CARDS */}
        <div className="plan-target-grid">
          <div className="plan-target-card">
            <ActivityIntensityIcon size={24} />
            <div>
              <span className="target-label">Overall Progress</span>
              <span className="target-val text-emerald">{progress}%</span>
            </div>
          </div>

          <div className="plan-target-card">
            <span className="target-icon">📅</span>
            <div>
              <span className="target-label">Current Timeline</span>
              <span className="target-val">Month {currentMonth} of {durationMonths}</span>
            </div>
          </div>

          <div className="plan-target-card">
            <span className="target-icon">⭐</span>
            <div>
              <span className="target-label">Target Vitality Score</span>
              <span className="target-val text-positive">90+ / 100</span>
            </div>
          </div>
        </div>
      </header>

      {/* CORE GOALS & FOUNDATION GRID */}
      <div className="wealth-plan-middle-grid">
        {/* CORE HEALTH GOALS */}
        <section className="plan-goals-card" style={{ gridColumn: 'span 2' }}>
          <div className="card-top-head">
            <span className="icon">🎯</span>
            <h3>Core Health & Vitality Goals</h3>
          </div>
          <p className="card-subtext">Primary foundation pillars your HealthMargdarshi journey focuses on.</p>

          <div className="goals-stack">
            {goals.length > 0 ? (
              goals.map((g, idx) => (
                <div key={g._id || idx} className="goal-item">
                  <div className="goal-head">
                    <strong>{g.title}</strong>
                    <span className={`priority-badge p-${g.priority || 'medium'}`}>
                      {g.priority || 'medium'} priority
                    </span>
                  </div>
                  <p>{g.description}</p>
                </div>
              ))
            ) : (
              <div className="bar-desc">No health goals added yet.</div>
            )}
          </div>
        </section>
      </div>

      {/* 12-MONTH ROADMAP INTERACTIVE TABS */}
      <section className="roadmap-section">
        <div className="section-header">
          <div>
            <span className="eyebrow health-eyebrow">MONTHLY BLUEPRINT</span>
            <h2>12-Month Year at a Glance</h2>
            <p>Every month builds on habits, recovery, and fitness milestones from previous months.</p>
          </div>
        </div>

        {/* MONTH TABS SELECTOR */}
        <div className="month-tabs-scroller">
          {roadmap.map((m, idx) => {
            const mNum = Number(m.month || idx + 1);
            const isCurrent = mNum === currentMonth;
            const isCompleted = mNum < currentMonth;

            return (
              <button
                key={m._id || mNum}
                type="button"
                className={`month-tab-btn ${selectedMonth === mNum ? 'active' : ''}`}
                onClick={() => setSelectedMonth(mNum)}
              >
                <span className="m-num">Month {mNum}</span>
                <span className="m-focus">{m.focus || 'Wellness'}</span>
                {isCurrent && <small style={{ color: '#10b981', fontSize: '9px' }}>CURRENT</small>}
                {isCompleted && <small style={{ color: '#6b7280', fontSize: '9px' }}>DONE</small>}
              </button>
            );
          })}
        </div>

        {/* SELECTED MONTH DISPLAY PANEL */}
        {activeMonthData && (
          <div className="month-details-panel">
            <div className="panel-header">
              <div className="panel-header-left">
                <span className="month-badge">MONTH {activeMonthData.month} OF 12</span>
                <h3>{activeMonthData.title || `Month ${activeMonthData.month}`}</h3>
              </div>
              <span className="focus-pill">Focus: {activeMonthData.focus || 'Health & Vitality'}</span>
            </div>

            <div className="objective-box">
              <strong>Primary Focus Objective:</strong> {activeMonthData.objective || 'Build sustainable health and recovery habits.'}
            </div>

            <h4 className="milestones-heading">Month {activeMonthData.month} Actionable Milestones</h4>
            <div className="milestones-grid">
              {Array.isArray(activeMonthData.milestones) && activeMonthData.milestones.length > 0 ? (
                activeMonthData.milestones.map((ms, idx) => (
                  <div key={ms._id || idx} className="milestone-card">
                    <div className="ms-check-icon">✓</div>
                    <div>
                      <h5>{ms.title || 'Milestone'}</h5>
                      <p>{ms.description || 'Complete this milestone as part of your monthly journey.'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="milestone-card">
                  <div className="ms-check-icon">✓</div>
                  <div>
                    <h5>Daily Habit Consistency</h5>
                    <p>Maintain consistent sleep, hydration, and movement targets.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* DAILY DAY PROFILE CTA */}
      <div className="wealth-plan-cta-box">
        <div className="cta-left">
          <span className="cta-sparkle">✦</span>
          <div>
            <h3>Connect Your Daily Schedule with Day Profile</h3>
            <p>Tell HealthMargdarshi about your real daily routine, study/work hours, meals, and free time.</p>
          </div>
        </div>
        <button
          type="button"
          className="health-submit-btn"
          onClick={() => navigate('/day-profile')}
        >
          Create My Day Profile →
        </button>
      </div>

      {/* DISCLAIMER */}
      <div className="wealth-disclaimer-footer">
        <span>ⓘ</span>
        <p>
          This plan is intended for general wellness guidance, lifestyle organization, and habit building. It does not diagnose or treat medical conditions or replace professional medical advice.
        </p>
      </div>
    </div>
  );
}