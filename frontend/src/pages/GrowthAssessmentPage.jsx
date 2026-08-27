import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveGrowthProfile } from '../services/growthService';

const SKILLS_LIST = [
  { id: 'communication', name: 'Communication', desc: 'Expressing ideas clearly and actively listening.' },
  { id: 'confidence', name: 'Confidence', desc: 'Belief in your abilities and decision-making.' },
  { id: 'publicSpeaking', name: 'Public Speaking', desc: 'Presenting and speaking in front of groups.' },
  { id: 'timeManagement', name: 'Time Management', desc: 'Planning and prioritizing daily hours.' },
  { id: 'decisionMaking', name: 'Decision Making', desc: 'Making timely, logical choices under uncertainty.' },
  { id: 'problemSolving', name: 'Problem Solving', desc: 'Analyzing complex issues and finding solutions.' },
  { id: 'leadership', name: 'Leadership', desc: 'Inspiring, guiding, and coordinating others.' },
  { id: 'teamwork', name: 'Teamwork', desc: 'Collaborating and building trust in group settings.' },
  { id: 'discipline', name: 'Discipline', desc: 'Following through on commitments consistently.' },
  { id: 'focus', name: 'Focus', desc: 'Maintaining deep concentration without distraction.' },
  { id: 'emotionalControl', name: 'Emotional Control', desc: 'Managing stress and emotional responses.' },
  { id: 'consistency', name: 'Consistency', desc: 'Sustaining effort day after day over time.' },
];

const GOALS_OPTIONS = [
  'Become more confident',
  'Speak better',
  'Improve communication',
  'Become more disciplined',
  'Improve time management',
  'Become a better leader',
  'Become better at decision making',
  'Improve focus',
  'Become more consistent',
  'Become better at social interaction',
  'Become better at problem solving',
  'Prepare for career',
  'Become more productive',
];

const CHALLENGES_OPTIONS = [
  'Procrastination',
  'Phone distraction',
  'Lack of consistency',
  'Fear of speaking',
  'Overthinking',
  'Poor time management',
  'Lack of confidence',
  'Difficulty making decisions',
  'Lack of discipline',
  'Difficulty focusing',
  'Avoiding difficult tasks',
  'Difficulty communicating',
  'Lack of direction',
  'Other',
];

const TIME_OPTIONS = [
  { value: 15, label: '15 minutes/day' },
  { value: 30, label: '30 minutes/day' },
  { value: 45, label: '45 minutes/day' },
  { value: 60, label: '60 minutes/day' },
  { value: 90, label: '90+ minutes/day' },
];

const PREFERENCE_OPTIONS = [
  'Reading',
  'Watching',
  'Practicing',
  'Speaking',
  'Writing',
  'Real-world challenges',
  'Combination',
];

const CONTEXT_OPTIONS = [
  'Student',
  'Working Professional',
  'Job Seeker',
  'Entrepreneur',
  'Other',
];

const MATTERS_MOST_OPTIONS = [
  'Career',
  'College',
  'Personal confidence',
  'Communication',
  'Leadership',
  'Productivity',
  'Relationships',
  'Overall self-development',
];

export default function GrowthAssessmentPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [skillRatings, setSkillRatings] = useState({
    communication: 5,
    confidence: 4,
    publicSpeaking: 3,
    timeManagement: 5,
    decisionMaking: 6,
    problemSolving: 6,
    leadership: 4,
    teamwork: 7,
    discipline: 4,
    focus: 5,
    emotionalControl: 6,
    consistency: 4,
  });

  const [selectedGoals, setSelectedGoals] = useState(['Become more confident', 'Improve communication']);
  const [customGoal, setCustomGoal] = useState('');
  const [selectedChallenges, setSelectedChallenges] = useState(['Procrastination', 'Fear of speaking']);
  const [availableTimeMinutes, setAvailableTimeMinutes] = useState(30);
  const [learningPreferences, setLearningPreferences] = useState(['Practicing', 'Real-world challenges']);
  const [currentContext, setCurrentContext] = useState('Student');
  const [primaryFocus, setPrimaryFocus] = useState('Personal confidence');

  const handleRatingChange = (id, val) => {
    setSkillRatings((prev) => ({ ...prev, [id]: Number(val) }));
  };

  const toggleArrayItem = (arr, setArr, item) => {
    if (arr.includes(item)) {
      setArr(arr.filter((i) => i !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const handleNext = () => {
    setError('');
    if (step === 2 && selectedGoals.length === 0 && !customGoal.trim()) {
      setError('Please select at least one goal or enter a custom goal.');
      return;
    }
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setError('');
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/growth');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    const goalsList = [...selectedGoals];
    if (customGoal.trim()) goalsList.push(customGoal.trim());

    const payload = {
      skillRatings,
      goals: goalsList,
      challenges: selectedChallenges,
      customGoal,
      availableTimeMinutes,
      learningPreferences,
      currentContext,
      primaryFocus,
    };

    try {
      const res = await saveGrowthProfile(payload, token);
      if (res.success) {
        navigate('/growth');
      } else {
        setError(res.message || 'Failed to save growth profile.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wealth-page-container">
      {/* TOP NAVIGATION BAR */}
      <div className="wealth-top-nav">
        <button type="button" className="wealth-back-btn" onClick={handleBack}>
          ← {step === 1 ? 'Back' : `Step ${step - 1}`}
        </button>
        <span className="wealth-nav-badge">GROWTH ASSESSMENT · STEP {step} OF 6</span>
        <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 600 }}>
          {Math.round((step / 6) * 100)}% Complete
        </span>
      </div>

      {/* HEADER BANNER */}
      <div className="wealth-header">
        <div className="wealth-header-icon">✦</div>
        <div>
          <span className="eyebrow">GROWTHMARGDARSHI</span>
          <h1 className="wealth-title">Let's understand where you are.</h1>
          <p className="wealth-subtitle">
            Growth starts with knowing yourself. Tell us where you are today, and we'll help you decide where to go next.
          </p>
        </div>
      </div>

      {error && (
        <div className="wealth-alert wealth-alert-error" style={{ marginBottom: '24px' }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* STEP 1: SKILL RATINGS */}
      {step === 1 && (
        <div className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step">1</span>
            <h3>Rate Your Current Skills (1 – 10)</h3>
          </div>
          <p className="section-desc">Be honest with yourself. This baseline determines your custom roadmap.</p>

          <div className="wealth-grid-2">
            {SKILLS_LIST.map((s) => (
              <div key={s.id} className="budget-bar-card" style={{ marginBottom: '12px' }}>
                <div className="bar-card-header">
                  <div>
                    <strong className="bar-title">{s.name}</strong>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>{s.desc}</p>
                  </div>
                  <span className="bar-values" style={{ color: '#10b981', fontSize: '18px' }}>
                    {skillRatings[s.id]} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={skillRatings[s.id]}
                  onChange={(e) => handleRatingChange(s.id, e.target.value)}
                  style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer', height: '6px' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: GOALS */}
      {step === 2 && (
        <div className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step">2</span>
            <h3>What do you want to become better at?</h3>
          </div>
          <p className="section-desc">Select all goals that matter to you right now.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
            {GOALS_OPTIONS.map((g) => {
              const active = selectedGoals.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleArrayItem(selectedGoals, setSelectedGoals, g)}
                  className={`wealth-secondary-btn ${active ? 'wealth-action-btn' : ''}`}
                  style={{
                    borderRadius: '16px',
                    padding: '12px 20px',
                    border: active ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {active ? '✓ ' : '+ '}
                  {g}
                </button>
              );
            })}
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label>Custom Goal (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Become more structured in client meetings"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* STEP 3: CURRENT CHALLENGES */}
      {step === 3 && (
        <div className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step">3</span>
            <h3>What's getting in your way?</h3>
          </div>
          <p className="section-desc">Identifying obstacles helps us build high-impact practice routines.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {CHALLENGES_OPTIONS.map((c) => {
              const active = selectedChallenges.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleArrayItem(selectedChallenges, setSelectedChallenges, c)}
                  className={`wealth-secondary-btn ${active ? 'wealth-action-btn' : ''}`}
                  style={{
                    borderRadius: '16px',
                    padding: '12px 20px',
                    border: active ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {active ? '● ' : '○ '}
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: GROWTH TIME */}
      {step === 4 && (
        <div className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step">4</span>
            <h3>How much time can you realistically invest in yourself daily?</h3>
          </div>
          <p className="section-desc">We will design daily action tasks strictly within your allocated time.</p>

          <div className="wealth-grid-3">
            {TIME_OPTIONS.map((t) => {
              const active = availableTimeMinutes === t.value;
              return (
                <div
                  key={t.value}
                  onClick={() => setAvailableTimeMinutes(t.value)}
                  className="plan-target-card"
                  style={{
                    cursor: 'pointer',
                    borderColor: active ? '#10b981' : 'rgba(255,255,255,0.1)',
                    background: active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  }}
                >
                  <span className="target-icon">⏱️</span>
                  <div>
                    <span className="target-label">Daily Allocation</span>
                    <span className="target-val">{t.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 5: LEARNING PREFERENCES */}
      {step === 5 && (
        <div className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step">5</span>
            <h3>How do you prefer to improve?</h3>
          </div>
          <p className="section-desc">Select your preferred learning and practice formats.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {PREFERENCE_OPTIONS.map((p) => {
              const active = learningPreferences.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleArrayItem(learningPreferences, setLearningPreferences, p)}
                  className={`wealth-secondary-btn ${active ? 'wealth-action-btn' : ''}`}
                  style={{
                    borderRadius: '16px',
                    padding: '12px 20px',
                  }}
                >
                  {active ? '✓ ' : '+ '}
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 6: CONTEXT & PRIMARY FOCUS */}
      {step === 6 && (
        <div className="wealth-form-section">
          <div className="section-title-row">
            <span className="section-step">6</span>
            <h3>Your Context & Primary Focus</h3>
          </div>
          <p className="section-desc">Tell us your current life situation and what matters most right now.</p>

          <div className="wealth-grid-2">
            <div className="form-group">
              <label>Current Situation</label>
              <select value={currentContext} onChange={(e) => setCurrentContext(e.target.value)}>
                {CONTEXT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>What matters most to you right now?</label>
              <select value={primaryFocus} onChange={(e) => setPrimaryFocus(e.target.value)}>
                {MATTERS_MOST_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
        <button type="button" className="wealth-secondary-btn" onClick={handleBack}>
          ← Back
        </button>

        {step < 6 ? (
          <button type="button" className="wealth-action-btn" onClick={handleNext}>
            Continue →
          </button>
        ) : (
          <button type="button" className="wealth-action-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Building Your Profile...' : 'Build My Growth Profile ✦'}
          </button>
        )}
      </div>
    </div>
  );
}
