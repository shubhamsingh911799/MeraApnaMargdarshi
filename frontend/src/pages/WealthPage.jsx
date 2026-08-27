import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWealthProfile, saveWealthProfile } from '../services/wealthService';
import { WealthVisualIcon } from '../components/AnimatedIcons';

export default function WealthPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    monthlyIncome: '',
    incomeSources: 'Salary / Primary Employment',
    fixedExpenses: '',
    variableExpenses: '',
    currentSavings: '',
    currentInvestments: '',
    totalDebt: '',
    riskTolerance: 'Moderate',
    primaryGoal: 'Wealth Building',
    targetEmergencyFundMonths: 6,
  });

  /* =========================================================
     LOAD EXISTING PROFILE
  ========================================================= */

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await getWealthProfile(token);
        console.log('WEALTH PROFILE FETCH:', res);

        const p = res.data?.wealthProfile || res.data;
        if (res.success && p && (p._id || p.monthlyIncome !== undefined)) {
          setForm({
            monthlyIncome: p.monthlyIncome ?? '',
            incomeSources: p.incomeSources || 'Salary / Primary Employment',
            fixedExpenses: p.fixedExpenses ?? '',
            variableExpenses: p.variableExpenses ?? '',
            currentSavings: p.currentSavings ?? '',
            currentInvestments: p.currentInvestments ?? '',
            totalDebt: p.totalDebt ?? '',
            riskTolerance: p.riskTolerance || 'Moderate',
            primaryGoal: p.primaryGoal || 'Wealth Building',
            targetEmergencyFundMonths: p.targetEmergencyFundMonths ?? 6,
          });
        }
      } catch (err) {
        console.log('No existing wealth profile or error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  /* =========================================================
     FORM HANDLERS
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!form.monthlyIncome || Number(form.monthlyIncome) < 0) {
      setError('Please enter a valid monthly income.');
      return;
    }

    if (form.fixedExpenses === '' || Number(form.fixedExpenses) < 0) {
      setError('Please enter valid fixed expenses.');
      return;
    }

    if (form.variableExpenses === '' || Number(form.variableExpenses) < 0) {
      setError('Please enter valid variable expenses.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        monthlyIncome: Number(form.monthlyIncome),
        incomeSources: form.incomeSources,
        fixedExpenses: Number(form.fixedExpenses),
        variableExpenses: Number(form.variableExpenses),
        currentSavings: Number(form.currentSavings || 0),
        currentInvestments: Number(form.currentInvestments || 0),
        totalDebt: Number(form.totalDebt || 0),
        riskTolerance: form.riskTolerance,
        primaryGoal: form.primaryGoal,
        targetEmergencyFundMonths: Number(form.targetEmergencyFundMonths || 6),
      };

      const res = await saveWealthProfile(payload, token);
      console.log('SAVE WEALTH PROFILE RES:', res);

      if (res.success) {
        setMessage('Wealth profile saved successfully! Redirecting to analysis...');
        setTimeout(() => {
          navigate('/wealth-analysis');
        }, 1200);
      } else {
        setError(res.message || 'Failed to save wealth profile.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset your Wealth Profile data? This will clear your income, expense budgets, and wealth roadmap.")) {
      try {
        setLoading(true);
        await api.resetWealthProfile(token);
        setForm({
          monthlyIncome: '',
          incomeSources: 'Salary / Primary Employment',
          fixedExpenses: '',
          variableExpenses: '',
          currentSavings: '',
          currentInvestments: '',
          totalDebt: '',
          riskTolerance: 'Moderate',
          primaryGoal: 'Wealth Building',
          targetEmergencyFundMonths: 6,
        });
        setMessage('Wealth profile reset successfully.');
      } catch (err) {
        setError('Failed to reset wealth profile.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="wealth-page-container">
        <div className="analysis-loading">
          <div className="analysis-loader" />
          <p>Loading your WealthMargdarshi profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wealth-page-container">
      {/* NAVIGATION BAR */}
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
            style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
            onClick={handleReset}
          >
            🔄 Reset Wealth Data
          </button>
          <span className="wealth-nav-badge">
            ✦ WEALTHMARGDARSHI SETUP
          </span>
        </div>
      </div>

      {/* HEADER */}
      <header className="wealth-header">
        <WealthVisualIcon size={46} />
        <div>
          <h1 className="wealth-title">WealthMargdarshi Setup</h1>
          <p className="wealth-subtitle">
            Configure your monthly cash flow, savings, debts, and risk profile to generate a intelligent financial health analysis & 12-month wealth roadmap.
          </p>
        </div>
      </header>

      {/* ALERT MESSAGES */}
      {error && (
        <div className="wealth-alert wealth-alert-error">
          <span>⚠️</span> {error}
        </div>
      )}
      {message && (
        <div className="wealth-alert wealth-alert-success">
          <span>✅</span> {message}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="wealth-form">
        {/* SECTION 1: INCOME & CASH FLOW */}
        <section className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step">1</span>
            <h3>Monthly Cash Flow & Income</h3>
          </div>
          <p className="section-desc">Understand your regular inflows and monthly commitments.</p>

          <div className="wealth-grid-2">
            <div className="form-group">
              <label htmlFor="monthlyIncome">Total Monthly Income ($)</label>
              <input
                type="number"
                id="monthlyIncome"
                name="monthlyIncome"
                placeholder="e.g. 5000"
                value={form.monthlyIncome}
                onChange={handleChange}
                required
              />
              <small className="form-help">Take-home salary, stipend, business earnings, freelancing</small>
            </div>

            <div className="form-group">
              <label htmlFor="incomeSources">Primary Income Sources</label>
              <select
                id="incomeSources"
                name="incomeSources"
                value={form.incomeSources}
                onChange={handleChange}
              >
                <option value="Salary / Primary Employment">Salary / Primary Employment</option>
                <option value="Business / Self-Employed">Business / Self-Employed</option>
                <option value="Freelancing / Consulting">Freelancing / Consulting</option>
                <option value="Student Stipend / Allowance">Student Stipend / Allowance</option>
                <option value="Multiple Income Streams">Multiple Income Streams</option>
              </select>
            </div>
          </div>
        </section>

        {/* SECTION 2: LIVING EXPENSES */}
        <section className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step">2</span>
            <h3>Monthly Expenses Breakdown</h3>
          </div>
          <p className="section-desc">Separate essential non-negotiables from discretionary spending.</p>

          <div className="wealth-grid-2">
            <div className="form-group">
              <label htmlFor="fixedExpenses">Fixed Essential Expenses ($)</label>
              <input
                type="number"
                id="fixedExpenses"
                name="fixedExpenses"
                placeholder="e.g. 2000"
                value={form.fixedExpenses}
                onChange={handleChange}
                required
              />
              <small className="form-help">Rent, utility bills, groceries, insurance, essential EMI</small>
            </div>

            <div className="form-group">
              <label htmlFor="variableExpenses">Variable & Lifestyle Expenses ($)</label>
              <input
                type="number"
                id="variableExpenses"
                name="variableExpenses"
                placeholder="e.g. 1000"
                value={form.variableExpenses}
                onChange={handleChange}
                required
              />
              <small className="form-help">Dining out, entertainment, shopping, leisure, travel</small>
            </div>
          </div>
        </section>

        {/* SECTION 3: SAVINGS & LIABILITIES */}
        <section className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step">3</span>
            <h3>Assets, Savings & Debts</h3>
          </div>
          <p className="section-desc">Assess your current safety buffer and debt obligations.</p>

          <div className="wealth-grid-3">
            <div className="form-group">
              <label htmlFor="currentSavings">Liquid Savings Reserve ($)</label>
              <input
                type="number"
                id="currentSavings"
                name="currentSavings"
                placeholder="e.g. 8000"
                value={form.currentSavings}
                onChange={handleChange}
              />
              <small className="form-help">Bank balance & emergency cash</small>
            </div>

            <div className="form-group">
              <label htmlFor="currentInvestments">Active Investments ($)</label>
              <input
                type="number"
                id="currentInvestments"
                name="currentInvestments"
                placeholder="e.g. 5000"
                value={form.currentInvestments}
                onChange={handleChange}
              />
              <small className="form-help">Stocks, Mutual Funds, FD, Gold, Crypto</small>
            </div>

            <div className="form-group">
              <label htmlFor="totalDebt">Total Outstanding Debt ($)</label>
              <input
                type="number"
                id="totalDebt"
                name="totalDebt"
                placeholder="e.g. 1500"
                value={form.totalDebt}
                onChange={handleChange}
              />
              <small className="form-help">Credit card debt, loans, pay-later</small>
            </div>
          </div>
        </section>

        {/* SECTION 4: GOALS & RISK STRATEGY */}
        <section className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step">4</span>
            <h3>Goals & Risk Preference</h3>
          </div>
          <p className="section-desc">Tailor your 12-month financial strategy.</p>

          <div className="wealth-grid-3">
            <div className="form-group">
              <label htmlFor="primaryGoal">Primary Financial Priority</label>
              <select
                id="primaryGoal"
                name="primaryGoal"
                value={form.primaryGoal}
                onChange={handleChange}
              >
                <option value="Emergency Savings">Build Emergency Safety Net</option>
                <option value="Debt Payoff">Aggressive Debt Payoff</option>
                <option value="Wealth Building">Wealth Accumulation & Investing</option>
                <option value="Budgeting & Control">Expense Control & Budgeting</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="riskTolerance">Investment Risk Appetite</label>
              <select
                id="riskTolerance"
                name="riskTolerance"
                value={form.riskTolerance}
                onChange={handleChange}
              >
                <option value="Low">Low (Capital Preservation / FD / Debt Funds)</option>
                <option value="Moderate">Moderate (Balanced Index Funds & Mutual Funds)</option>
                <option value="High">High (Growth Stocks, Equity & Crypto)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="targetEmergencyFundMonths">Emergency Fund Target (Months)</label>
              <select
                id="targetEmergencyFundMonths"
                name="targetEmergencyFundMonths"
                value={form.targetEmergencyFundMonths}
                onChange={handleChange}
              >
                <option value={3}>3 Months of Expenses</option>
                <option value={6}>6 Months of Expenses (Recommended)</option>
                <option value={12}>12 Months of Expenses</option>
              </select>
            </div>
          </div>
        </section>

        {/* SUBMIT BUTTON */}
        <div className="wealth-submit-row">
          <button
            type="submit"
            className="wealth-submit-btn"
            disabled={saving}
          >
            {saving ? 'Analyzing Financial Profile...' : 'Save & View Wealth Analysis →'}
          </button>
        </div>
      </form>
    </div>
  );
}
