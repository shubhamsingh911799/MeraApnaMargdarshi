import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { HealthVisualIcon } from '../components/AnimatedIcons';

export default function HealthPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    age: '',
    height: '',
    weight: '',
    activityLevel: 'Moderate Activity',
    collegeWorkTiming: '09:00 - 17:00',
    sleepTime: '23:00',
    wakeTime: '07:00',
    exercise: '30 mins light cardio / walking',
    foodPreference: 'Vegetarian',
    healthConditions: 'None',
  });

  /* =========================================================
     LOAD EXISTING PROFILE IF AVAILABLE
  ========================================================= */

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await api.getHealthProfile(token);
        console.log('HEALTH PROFILE FETCH:', res);

        const p = res.data?.healthProfile || res.data;
        if (res.success && p && (p._id || p.age !== undefined)) {
          setForm({
            age: p.age ?? '',
            height: p.height ?? '',
            weight: p.weight ?? '',
            activityLevel: p.activityLevel || 'Moderate Activity',
            collegeWorkTiming: p.collegeWorkTiming || '',
            sleepTime: p.sleepTime || '23:00',
            wakeTime: p.wakeTime || '07:00',
            exercise: p.exercise || '',
            foodPreference: p.foodPreference || 'Vegetarian',
            healthConditions: p.healthConditions || '',
          });
        }
      } catch (err) {
        console.log('No existing health profile found or error:', err.message);
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

    if (!form.age || Number(form.age) < 10 || Number(form.age) > 100) {
      setError('Please enter a valid age between 10 and 100.');
      return;
    }

    if (!form.height || Number(form.height) < 50 || Number(form.height) > 250) {
      setError('Please enter a valid height in cm (50 - 250 cm).');
      return;
    }

    if (!form.weight || Number(form.weight) < 10 || Number(form.weight) > 300) {
      setError('Please enter a valid weight in kg (10 - 300 kg).');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight),
        activityLevel: form.activityLevel,
        collegeWorkTiming: form.collegeWorkTiming,
        sleepTime: form.sleepTime,
        wakeTime: form.wakeTime,
        exercise: form.exercise,
        foodPreference: form.foodPreference,
        healthConditions: form.healthConditions,
      };

      const res = await api.saveHealthProfile(payload, token);
      console.log('SAVE HEALTH PROFILE RES:', res);

      if (res.success) {
        setMessage('Health profile saved successfully! Redirecting to analysis...');
        setTimeout(() => {
          navigate('/health-analysis');
        }, 1200);
      } else {
        setError(res.message || 'Failed to save health profile.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset your Health Profile data? This will clear your biometrics, lifestyle score, and 12-month wellness plan.")) {
      try {
        setLoading(true);
        await api.resetHealthProfile(token);
        setForm({
          age: '',
          height: '',
          weight: '',
          activityLevel: 'Moderate Activity',
          collegeWorkTiming: '09:00 - 17:00',
          sleepTime: '23:00',
          wakeTime: '07:00',
          exercise: '30 mins light cardio / walking',
          foodPreference: 'Vegetarian',
          healthConditions: 'None',
        });
        setMessage('Health profile reset successfully.');
      } catch (err) {
        setError('Failed to reset health profile.');
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
          <p>Loading your HealthMargdarshi profile setup...</p>
        </div>
      </div>
    );
  }

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
            style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
            onClick={handleReset}
          >
            🔄 Reset Health Data
          </button>
          <span className="health-nav-badge">
            ✦ HEALTHMARGDARSHI SETUP
          </span>
        </div>
      </div>

      {/* HEADER */}
      <header className="health-header-box">
        <HealthVisualIcon size={46} />
        <div>
          <h1 className="wealth-title">HealthMargdarshi Setup</h1>
          <p className="wealth-subtitle">
            Input your body metrics, sleep schedule, and daily movement to generate your personalized health health score & 12-month wellness plan.
          </p>
        </div>
      </header>

      {/* ALERTS */}
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

      {/* SETUP FORM */}
      <form onSubmit={handleSubmit} className="wealth-form">
        {/* SECTION 1: BODY METRICS */}
        <section className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step health-step">1</span>
            <h3>Body & Biometric Fundamentals</h3>
          </div>
          <p className="section-desc">Key metrics used to calculate Body Mass Index (BMI) and metabolic baseline.</p>

          <div className="wealth-grid-3">
            <div className="form-group">
              <label htmlFor="age">Age (years)</label>
              <input
                type="number"
                id="age"
                name="age"
                placeholder="e.g. 24"
                value={form.age}
                onChange={handleChange}
                required
              />
              <small className="form-help">Must be between 10 and 100 years</small>
            </div>

            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                placeholder="e.g. 175"
                value={form.height}
                onChange={handleChange}
                required
              />
              <small className="form-help">Height in centimeters</small>
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                placeholder="e.g. 68"
                value={form.weight}
                onChange={handleChange}
                required
              />
              <small className="form-help">Weight in kilograms</small>
            </div>
          </div>
        </section>

        {/* SECTION 2: SLEEP & CIRCADIAN RHYTHM */}
        <section className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step health-step">2</span>
            <h3>Sleep & Circadian Schedule</h3>
          </div>
          <p className="section-desc">Track recovery duration and consistency for optimal daily energy.</p>

          <div className="wealth-grid-3">
            <div className="form-group">
              <label htmlFor="sleepTime">Bedtime (HH:MM)</label>
              <input
                type="time"
                id="sleepTime"
                name="sleepTime"
                value={form.sleepTime}
                onChange={handleChange}
                required
              />
              <small className="form-help">Usual sleep time (24h format)</small>
            </div>

            <div className="form-group">
              <label htmlFor="wakeTime">Wakeup Time (HH:MM)</label>
              <input
                type="time"
                id="wakeTime"
                name="wakeTime"
                value={form.wakeTime}
                onChange={handleChange}
                required
              />
              <small className="form-help">Usual wake time (24h format)</small>
            </div>

            <div className="form-group">
              <label htmlFor="collegeWorkTiming">College / Work Window</label>
              <input
                type="text"
                id="collegeWorkTiming"
                name="collegeWorkTiming"
                placeholder="e.g. 09:00 AM - 05:00 PM"
                value={form.collegeWorkTiming}
                onChange={handleChange}
              />
              <small className="form-help">Daily study or office commitment</small>
            </div>
          </div>
        </section>

        {/* SECTION 3: PHYSICAL ACTIVITY & DIET */}
        <section className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step health-step">3</span>
            <h3>Movement, Diet & Health Notes</h3>
          </div>
          <p className="section-desc">Describe your daily activity level, exercise habits, and dietary preferences.</p>

          <div className="wealth-grid-2">
            <div className="form-group">
              <label htmlFor="activityLevel">Daily Activity Level</label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={form.activityLevel}
                onChange={handleChange}
              >
                <option value="Sedentary">Sedentary (Mostly sitting, minimal walking)</option>
                <option value="Lightly Active">Lightly Active (1-3 days light exercise/wk)</option>
                <option value="Moderate Activity">Moderate Activity (3-5 days moderate workout/wk)</option>
                <option value="High Activity">High Activity (6-7 days intense exercise/wk)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="foodPreference">Food Preference</label>
              <select
                id="foodPreference"
                name="foodPreference"
                value={form.foodPreference}
                onChange={handleChange}
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Eggetarian">Eggetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Keto / Low Carb">Keto / Low Carb</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="exercise">Exercise & Workout Habit</label>
              <input
                type="text"
                id="exercise"
                name="exercise"
                placeholder="e.g. 30 mins morning jog or gym"
                value={form.exercise}
                onChange={handleChange}
              />
              <small className="form-help">Sports, gym routine, yoga, cardio, or walking</small>
            </div>

            <div className="form-group">
              <label htmlFor="healthConditions">Medical Notes / Conditions (Optional)</label>
              <input
                type="text"
                id="healthConditions"
                name="healthConditions"
                placeholder="e.g. None, Mild Asthma, High BP"
                value={form.healthConditions}
                onChange={handleChange}
              />
              <small className="form-help">Any health details we should consider</small>
            </div>
          </div>
        </section>

        {/* SUBMIT BUTTON */}
        <div className="wealth-submit-row">
          <button
            type="submit"
            className="health-submit-btn"
            disabled={saving}
          >
            {saving ? 'Analyzing Health Profile...' : 'Save & View Health Analysis →'}
          </button>
        </div>
      </form>
    </div>
  );
}