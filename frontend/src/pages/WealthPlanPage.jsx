import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateWealthPlan, getWealthPlan } from '../services/wealthService';
import { WealthVisualIcon, GrowthVisualIcon } from '../components/AnimatedIcons';

export default function WealthPlanPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(1);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const loadPlan = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getWealthPlan(token);
        console.log('WEALTH PLAN FETCH RES:', res);

        if (res.success && res.data && res.data.wealthPlan) {
          setPlan(res.data.wealthPlan);
        } else {
          // Try generating plan
          handleGenerate();
        }
      } catch (err) {
        console.log('Plan fetch error, trying generation:', err.message);
        handleGenerate();
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [token]);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError('');
      const res = await generateWealthPlan(token);
      console.log('WEALTH PLAN GENERATE RES:', res);

      if (res.success && res.data && res.data.wealthPlan) {
        setPlan(res.data.wealthPlan);
      } else {
        setError(res.message || 'Unable to generate wealth plan.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Complete your wealth profile first to generate your 12-month plan.');
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  if (loading || generating) {
    return (
      <div className="wealth-page-container">
        <div className="analysis-loading">
          <div className="analysis-loader" />
          <p>Generating your personalized 12-month wealth roadmap...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
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
          <div className="error-icon">💎</div>
          <h2>Wealth Plan Generation</h2>
          <p>{error || 'Please complete your wealth profile to unlock your personalized 12-month roadmap.'}</p>
          <div className="btn-row">
            <button
              type="button"
              className="wealth-submit-btn"
              onClick={() => navigate('/wealth')}
            >
              Set Up Wealth Profile →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeMonthData = plan.monthlyRoadmap?.find((m) => m.month === selectedMonth) || plan.monthlyRoadmap?.[0];

  return (
    <div className="wealth-page-container">
      {/* NAV BAR */}
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
            onClick={() => navigate('/wealth-analysis')}
          >
            📊 Financial Analysis
          </button>
          <button
            type="button"
            className="wealth-secondary-btn"
            onClick={handleGenerate}
          >
            🔄 Regenerate Roadmap
          </button>
        </div>
      </div>

      {/* HEADER */}
      <header className="wealth-plan-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', width: '100%' }}>
          <WealthVisualIcon size={46} />
          <div className="plan-header-main">
            <span className="eyebrow">WEALTHMARGDARSHI · 12-MONTH ROADMAP</span>
            <h1>{plan.planTitle || '12-Month Financial Mastery Roadmap'}</h1>
            <p>A structured step-by-step blueprint designed to build cash liquidity, eliminate high-risk debt, and accelerate long-term compound wealth.</p>
          </div>
        </div>

        {/* TARGET HIGHLIGHT CARDS */}
        <div className="plan-target-grid">
          <div className="plan-target-card">
            <WealthVisualIcon size={32} />
            <div>
              <span className="target-label">Monthly Savings Goal</span>
              <span className="target-val">${plan.monthlySavingsTarget?.toLocaleString()}/mo</span>
            </div>
          </div>

          <div className="plan-target-card">
            <WealthVisualIcon size={32} />
            <div>
              <span className="target-label">Emergency Fund Goal</span>
              <span className="target-val">${plan.emergencyFundTarget?.toLocaleString()}</span>
            </div>
          </div>

          <div className="plan-target-card">
            <GrowthVisualIcon size={32} />
            <div>
              <span className="target-label">Financial Score Target</span>
              <span className="target-val text-emerald">85+ / 100</span>
            </div>
          </div>
        </div>
      </header>

      {/* STRATEGIC ALLOCATION & GOALS GRID */}
      <div className="wealth-plan-middle-grid">
        {/* INVESTMENT STRATEGY CARD */}
        <section className="allocation-card">
          <div className="card-top-head">
            <WealthVisualIcon size={28} />
            <h3>Asset & Risk Allocation Strategy</h3>
          </div>
          <p className="card-subtext">Recommended monthly investment distribution based on your risk profile.</p>

          <div className="allocation-bars">
            <div className="alloc-item">
              <div className="alloc-head">
                <span>Low Risk (FD, Liquid, Bonds)</span>
                <strong>{plan.investmentAllocation?.lowRiskPercent}%</strong>
              </div>
              <div className="alloc-track">
                <div className="alloc-fill bg-emerald" style={{ width: `${plan.investmentAllocation?.lowRiskPercent}%` }} />
              </div>
            </div>

            <div className="alloc-item">
              <div className="alloc-head">
                <span>Moderate Risk (Index Funds, Flexi-Cap)</span>
                <strong>{plan.investmentAllocation?.moderateRiskPercent}%</strong>
              </div>
              <div className="alloc-track">
                <div className="alloc-fill bg-accent" style={{ width: `${plan.investmentAllocation?.moderateRiskPercent}%` }} />
              </div>
            </div>

            <div className="alloc-item">
              <div className="alloc-head">
                <span>High Risk (Growth Equities, Crypto)</span>
                <strong>{plan.investmentAllocation?.highRiskPercent}%</strong>
              </div>
              <div className="alloc-track">
                <div className="alloc-fill bg-warning" style={{ width: `${plan.investmentAllocation?.highRiskPercent}%` }} />
              </div>
            </div>
          </div>
        </section>

        {/* PRIMARY GOALS LIST */}
        <section className="plan-goals-card">
          <div className="card-top-head">
            <GrowthVisualIcon size={28} />
            <h3>Primary Strategic Targets</h3>
          </div>
          <div className="goals-stack">
            {plan.goals?.map((g, idx) => (
              <div key={idx} className="goal-item">
                <div className="goal-head">
                  <strong>{g.title}</strong>
                  <span className={`priority-badge p-${g.priority}`}>{g.priority} priority</span>
                </div>
                <p>{g.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 12 MONTH ROADMAP INTERACTIVE TABS */}
      <section className="roadmap-section">
        <div className="section-header">
          <span className="eyebrow">MONTHLY BLUEPRINT</span>
          <h2>12-Month Step-by-Step Action Plan</h2>
          <p>Select any month to inspect specific objectives and milestone checklists.</p>
        </div>

        {/* MONTH TABS SELECTOR */}
        <div className="month-tabs-scroller">
          {plan.monthlyRoadmap?.map((m) => (
            <button
              key={m.month}
              type="button"
              className={`month-tab-btn ${selectedMonth === m.month ? 'active' : ''}`}
              onClick={() => setSelectedMonth(m.month)}
            >
              <span className="m-num">Month {m.month}</span>
              <span className="m-focus">{m.focus}</span>
            </button>
          ))}
        </div>

        {/* SELECTED MONTH DISPLAY PANEL */}
        {activeMonthData && (
          <div className="month-details-panel">
            <div className="panel-header">
              <div className="panel-header-left">
                <span className="month-badge">MONTH {activeMonthData.month} OF 12</span>
                <h3>{activeMonthData.title}</h3>
              </div>
              <span className="focus-pill">Focus: {activeMonthData.focus}</span>
            </div>

            <div className="objective-box">
              <strong>Objective:</strong> {activeMonthData.objective}
            </div>

            <h4 className="milestones-heading">Month {activeMonthData.month} Actionable Milestones</h4>
            <div className="milestones-grid">
              {activeMonthData.milestones?.map((ms, idx) => (
                <div key={idx} className="milestone-card">
                  <div className="ms-check-icon">✓</div>
                  <div>
                    <h5>{ms.title}</h5>
                    <p>{ms.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* WEALTH DISCLAIMER */}
      <div className="wealth-disclaimer-footer">
        <span>ⓘ</span>
        <p>
          WealthMargdarshi provides analytical decision support and financial organization tools. It does not replace professional financial advice from certified financial planners or regulated fiduciary advisors.
        </p>
      </div>
    </div>
  );
}
