import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWealthAnalysis } from '../services/wealthService';

export default function WealthAnalysisPage() {
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
        const res = await getWealthAnalysis(token);
        console.log('WEALTH ANALYSIS RESPONSE:', res);

        if (res.success && res.data) {
          setAnalysis(res.data);
        } else {
          setError(res.message || 'Unable to load wealth analysis.');
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Unable to load wealth analysis.');
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
          <p>Analyzing your financial cash flow & savings health...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
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
          <div className="error-icon">💡</div>
          <h2>Wealth Profile Required</h2>
          <p>{error || 'Please complete your wealth profile to unlock your financial health analysis.'}</p>
          <button
            type="button"
            className="wealth-submit-btn"
            onClick={() => navigate('/wealth')}
          >
            Set Up Wealth Profile Now →
          </button>
        </div>
      </div>
    );
  }

  const { metrics, recommendations, profile } = analysis;
  const {
    score,
    category,
    cashFlow,
    savingsRate,
    emergencyRunwayMonths,
    debtToIncomeRatio,
    totalExpenses,
    monthlyIncome,
    budgetActual,
    budgetIdeal,
  } = metrics;

  // Category Color
  const getCategoryClass = (cat) => {
    if (cat === 'Excellent') return 'badge-green';
    if (cat === 'Good') return 'badge-emerald';
    if (cat === 'Fair') return 'badge-yellow';
    return 'badge-red';
  };

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
            onClick={() => navigate('/wealth')}
          >
            ✏️ Edit Profile
          </button>

          <button
            type="button"
            className="wealth-action-btn"
            onClick={() => navigate('/wealth-plan')}
          >
            View 12-Month Plan →
          </button>
        </div>
      </div>

      {/* HEADER BANNER */}
      <header className="wealth-analysis-header">
        <div className="header-left">
          <span className="eyebrow">WEALTHMARGDARSHI · FINANCIAL ANALYSIS</span>
          <h1>Financial Health Snapshot</h1>
          <p>
            Real-time evaluation of cash flow, liquidity, debt safety, and savings velocity based on your financial inputs.
          </p>
        </div>

        {/* HEALTH SCORE GAUGE CARD */}
        <div className="health-score-card">
          <div className="score-ring-container">
            <svg className="score-ring" viewBox="0 0 100 100">
              <circle className="ring-bg" cx="50" cy="50" r="42" />
              <circle
                className="ring-progress"
                cx="50"
                cy="50"
                r="42"
                style={{
                  strokeDasharray: 264,
                  strokeDashoffset: 264 - (264 * score) / 100,
                }}
              />
            </svg>
            <div className="score-display">
              <span className="score-num">{score}</span>
              <span className="score-max">/100</span>
            </div>
          </div>

          <div className="score-meta">
            <span className="score-label">Financial Score</span>
            <span className={`score-category ${getCategoryClass(category)}`}>
              ● {category}
            </span>
          </div>
        </div>
      </header>

      {/* 4 CORE METRICS GRID */}
      <div className="wealth-metrics-grid">
        {/* CARD 1: CASH FLOW */}
        <div className="wealth-metric-card">
          <div className="metric-header">
            <span className="metric-icon">💵</span>
            <span className="metric-tag">CASH FLOW</span>
          </div>
          <h3 className="metric-title">Monthly Cash Flow</h3>
          <div className={`metric-value ${cashFlow >= 0 ? 'text-positive' : 'text-negative'}`}>
            {cashFlow >= 0 ? `+$${cashFlow.toLocaleString()}` : `-$${Math.abs(cashFlow).toLocaleString()}`}
          </div>
          <div className="metric-subtext">
            Income: ${monthlyIncome.toLocaleString()} | Expenses: ${totalExpenses.toLocaleString()}
          </div>
          <div className="metric-bar-bg">
            <div
              className={`metric-bar-fill ${cashFlow >= 0 ? 'bg-positive' : 'bg-negative'}`}
              style={{ width: `${Math.min(100, (totalExpenses / Math.max(1, monthlyIncome)) * 100)}%` }}
            />
          </div>
        </div>

        {/* CARD 2: SAVINGS RATE */}
        <div className="wealth-metric-card">
          <div className="metric-header">
            <span className="metric-icon">📈</span>
            <span className="metric-tag">VELOCITY</span>
          </div>
          <h3 className="metric-title">Savings Rate</h3>
          <div className="metric-value text-accent">
            {savingsRate}%
          </div>
          <div className="metric-subtext">
            {savingsRate >= 20 ? 'Target achieved (≥20% recommended)' : 'Target: 20% of monthly income'}
          </div>
          <div className="metric-bar-bg">
            <div
              className="metric-bar-fill bg-accent"
              style={{ width: `${Math.min(100, savingsRate)}%` }}
            />
          </div>
        </div>

        {/* CARD 3: EMERGENCY RUNWAY */}
        <div className="wealth-metric-card">
          <div className="metric-header">
            <span className="metric-icon">🛡️</span>
            <span className="metric-tag">SAFETY NET</span>
          </div>
          <h3 className="metric-title">Emergency Runway</h3>
          <div className="metric-value text-emerald">
            {emergencyRunwayMonths} <span className="unit">months</span>
          </div>
          <div className="metric-subtext">
            Reserve: ${profile.currentSavings.toLocaleString()} (Target: {profile.targetEmergencyFundMonths || 6} mos)
          </div>
          <div className="metric-bar-bg">
            <div
              className="metric-bar-fill bg-emerald"
              style={{
                width: `${Math.min(100, (emergencyRunwayMonths / (profile.targetEmergencyFundMonths || 6)) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* CARD 4: DEBT RATIO */}
        <div className="wealth-metric-card">
          <div className="metric-header">
            <span className="metric-icon">⚖️</span>
            <span className="metric-tag">LIABILITIES</span>
          </div>
          <h3 className="metric-title">Debt-to-Income</h3>
          <div className={`metric-value ${debtToIncomeRatio <= 20 ? 'text-positive' : 'text-warning'}`}>
            {debtToIncomeRatio}%
          </div>
          <div className="metric-subtext">
            Total Debt: ${profile.totalDebt.toLocaleString()}
          </div>
          <div className="metric-bar-bg">
            <div
              className={`metric-bar-fill ${debtToIncomeRatio <= 20 ? 'bg-positive' : 'bg-warning'}`}
              style={{ width: `${Math.min(100, debtToIncomeRatio)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 50/30/20 BUDGET RULE BREAKDOWN */}
      <section className="budget-breakdown-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">BUDGET OPTIMIZATION</span>
            <h2>50 / 30 / 20 Budget Allocation</h2>
            <p>Comparing your actual spending breakdown against the golden 50/30/20 financial rule.</p>
          </div>
          <div className="ideal-tag-badge">Ideal: 50% Needs | 30% Wants | 20% Savings</div>
        </div>

        <div className="budget-bars-grid">
          {/* NEEDS */}
          <div className="budget-bar-card">
            <div className="bar-card-header">
              <span className="bar-title">Needs (Fixed Expenses)</span>
              <span className="bar-values">{budgetActual.needs}% <small>(Ideal: {budgetIdeal.needs}%)</small></span>
            </div>
            <div className="budget-track">
              <div className="budget-fill fill-needs" style={{ width: `${Math.min(100, budgetActual.needs)}%` }} />
            </div>
            <p className="bar-desc">Rent, utilities, food, insurance: ${metrics.fixedExpenses.toLocaleString()}</p>
          </div>

          {/* WANTS */}
          <div className="budget-bar-card">
            <div className="bar-card-header">
              <span className="bar-title">Wants (Lifestyle Expenses)</span>
              <span className="bar-values">{budgetActual.wants}% <small>(Ideal: {budgetIdeal.wants}%)</small></span>
            </div>
            <div className="budget-track">
              <div className="budget-fill fill-wants" style={{ width: `${Math.min(100, budgetActual.wants)}%` }} />
            </div>
            <p className="bar-desc">Shopping, dining, entertainment: ${metrics.variableExpenses.toLocaleString()}</p>
          </div>

          {/* SAVINGS */}
          <div className="budget-bar-card">
            <div className="bar-card-header">
              <span className="bar-title">Savings & Wealth Creation</span>
              <span className="bar-values">{budgetActual.savings}% <small>(Ideal: {budgetIdeal.savings}%)</small></span>
            </div>
            <div className="budget-track">
              <div className="budget-fill fill-savings" style={{ width: `${Math.min(100, budgetActual.savings)}%` }} />
            </div>
            <p className="bar-desc">Monthly surplus retained for emergency & investments: ${Math.max(0, cashFlow).toLocaleString()}</p>
          </div>
        </div>
      </section>

      {/* RECOMMENDATIONS & RISKS */}
      <section className="wealth-recommendations-section">
        <div className="section-header">
          <span className="eyebrow">ACTIONABLE INSIGHTS</span>
          <h2>Tailored Financial Recommendations</h2>
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

      {/* NEXT STEP CTA */}
      <div className="wealth-plan-cta-box">
        <div className="cta-left">
          <span className="cta-sparkle">✦</span>
          <div>
            <h3>Ready to Execute Your Financial Roadmap?</h3>
            <p>Generate a 12-month step-by-step wealth plan with quarterly milestones and SIP asset allocations.</p>
          </div>
        </div>
        <button
          type="button"
          className="wealth-submit-btn"
          onClick={() => navigate('/wealth-plan')}
        >
          View 12-Month Wealth Plan →
        </button>
      </div>
    </div>
  );
}
