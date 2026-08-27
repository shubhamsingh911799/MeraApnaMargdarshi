import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getDayProfile,
  saveDayProfile,
} from '../services/dayProfileService';
import { DayProfileVisualIcon } from '../components/AnimatedIcons';

export default function DayProfilePage() {
   const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    wakeTime: '07:00',
    sleepTime: '23:00',

    collegeWork: {
      enabled: false,
      startTime: '',
      endTime: '',
    },

    commute: {
      enabled: false,
      durationMinutes: 0,
    },

    meals: {
      breakfast: '',
      lunch: '',
      dinner: '',
    },

    exercise: {
      enabled: false,
      preferredTime: '',
      durationMinutes: 0,
    },

    studyHours: 0,

    personalResponsibilities: '',

    relaxationTime: 0,

    fixedCommitments: '',

    flexibleTime: 0,

    weekdayType: 'both',
  });


  /* =========================================================
     LOAD EXISTING DAY PROFILE
  ========================================================= */

  useEffect(() => {
  if (!token) {
    setLoading(false);
    return;
  }

  const loadDayProfile = async () => {
    try {
      setLoading(true);

      const data = await getDayProfile(token);

      console.log("DAY PROFILE:", data);

      const p = data?.dayProfile || data;
      if (p && (p._id || p.wakeTime)) {
        setForm({
          wakeTime: p.wakeTime || "07:00",
          sleepTime: p.sleepTime || "23:00",

          collegeWork: {
            enabled: p.collegeWork?.enabled || false,
            startTime: p.collegeWork?.startTime || "",
            endTime: p.collegeWork?.endTime || "",
          },

          commute: {
            enabled: p.commute?.enabled || false,
            durationMinutes:
              p.commute?.durationMinutes || 0,
          },

          meals: {
            breakfast: p.meals?.breakfast || "",
            lunch: p.meals?.lunch || "",
            dinner: p.meals?.dinner || "",
          },

          exercise: {
            enabled: p.exercise?.enabled || false,
            preferredTime:
              p.exercise?.preferredTime || "",
            durationMinutes:
              p.exercise?.durationMinutes || 0,
          },

          studyHours: p.studyHours || 0,

          personalResponsibilities:
            p.personalResponsibilities || "",

          relaxationTime:
            p.relaxationTime || 0,

          fixedCommitments:
            p.fixedCommitments || "",

          flexibleTime:
            p.flexibleTime || 0,

          weekdayType:
            p.weekdayType || "both",
        });
      }
    } catch (err) {
      console.error("LOAD DAY PROFILE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  loadDayProfile();
}, [token]);


  /* =========================================================
     INPUT HELPERS
  ========================================================= */

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };


  const handleNestedChange = (
    section,
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,

      [section]: {
        ...previous[section],
        [field]: value,
      },
    }));
  };


  /* =========================================================
     SAVE
  ========================================================= */

  const handleSubmit = async (event) => {
    console.log("TOKEN:", token);
    event.preventDefault();

    

    setSaving(true);
    setMessage('');
    setError('');

    const payload = {
      ...form,
      wakeTime: form.wakeTime || '07:00',
      sleepTime: form.sleepTime || '23:00',

      studyHours: Number(form.studyHours || 0),
      relaxationTime: Number(form.relaxationTime || 0),
      flexibleTime: Number(form.flexibleTime || 0),

      commute: {
        ...form.commute,
        durationMinutes: Number(
          form.commute.durationMinutes || 0
        ),
      },

      exercise: {
        ...form.exercise,
        durationMinutes: Number(
          form.exercise.durationMinutes || 0
        ),
      },
    };

    console.log(
      'SENDING DAY PROFILE:',
      payload
    );

   try {

  await saveDayProfile(payload, token);

  setMessage(
    "Your day profile has been saved successfully!"
  );

  setTimeout(() => {
    navigate("/daily-plan");
  }, 1000);

} catch (err) {
  console.error(err);

  setError(
    err.message ||
    err?.response?.data?.message ||
    "Unable to save your day profile."
  );
}

    setSaving(false);
  };


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="day-profile-page">

        <div className="day-profile-loading">

          <div className="day-profile-loader"></div>

          <div>
            <strong>
              Loading your day profile
            </strong>

            <p>
              Preparing your daily life capture...
            </p>
          </div>

        </div>

      </div>
    );
  }


  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="day-profile-page">

      {/* =========================================
          HEADER & NAVIGATION BAR
      ========================================= */}

      <div className="wealth-top-nav" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="wealth-back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>

          <button
            type="button"
            className="wealth-back-btn"
            onClick={() => navigate('/health')}
          >
            ← Back to Health
          </button>
        </div>

        <button
          type="button"
          className="wealth-action-btn"
          onClick={() => navigate('/daily-plan')}
        >
          View Daily Plan →
        </button>
      </div>

      {/* =========================================
          HERO
      ========================================= */}

      <section className="wealth-header">
        <DayProfileVisualIcon size={46} />
        <div className="plan-header-main">
          <span className="eyebrow">MARGDARSHI · DAILY ROUTINE PROFILE</span>
          <h1>Tell us about your day</h1>
          <p>
            Capture your real daily schedule once. We will use it to build a personalized day-to-day routine and daily plan around your actual life commitments.
          </p>
        </div>
      </section>


      {/* =========================================
          FORM
      ========================================= */}

      <form
        className="day-profile-form"
        onSubmit={handleSubmit}
      >

        {/* =========================================
            BASIC DAY
        ========================================= */}

        <section className="day-profile-section">

          <div className="day-profile-section-heading">

            <span>01</span>

            <div>
              <p>YOUR DAY</p>

              <h2>
                Start and end of your day
              </h2>

              <small>
                Tell us when your normal day begins
                and ends.
              </small>
            </div>

          </div>


          <div className="day-profile-grid">

            <div className="day-profile-field">

              <label>
                Wake-up time
              </label>

              <input
                type="time"
                value={form.wakeTime}
                onChange={(e) =>
                  handleChange(
                    'wakeTime',
                    e.target.value
                  )
                }
                required
              />

            </div>


            <div className="day-profile-field">

              <label>
                Sleep time
              </label>

              <input
                type="time"
                value={form.sleepTime}
                onChange={(e) =>
                  handleChange(
                    'sleepTime',
                    e.target.value
                  )
                }
                required
              />

            </div>


            <div className="day-profile-field">

              <label>
                This schedule applies to
              </label>

              <select
                value={form.weekdayType}
                onChange={(e) =>
                  handleChange(
                    'weekdayType',
                    e.target.value
                  )
                }
              >
                <option value="both">
                  Weekdays & Weekends
                </option>

                <option value="weekday">
                  Weekdays
                </option>

                <option value="weekend">
                  Weekends
                </option>
              </select>

            </div>

          </div>

        </section>


        {/* =========================================
            COLLEGE / WORK
        ========================================= */}

        <section className="day-profile-section">

          <div className="day-profile-section-heading">

            <span>02</span>

            <div>
              <p>FIXED COMMITMENT</p>

              <h2>
                College or work
              </h2>

              <small>
                Fixed commitments help us understand
                which parts of your day cannot move.
              </small>
            </div>

          </div>


          <label className="day-profile-toggle">

            <input
              type="checkbox"
              checked={
                form.collegeWork.enabled
              }
              onChange={(e) =>
                handleNestedChange(
                  'collegeWork',
                  'enabled',
                  e.target.checked
                )
              }
            />

            <span>
              I have college / work commitments
            </span>

          </label>


          {form.collegeWork.enabled && (

            <div className="day-profile-grid">

              <div className="day-profile-field">

                <label>
                  Start time
                </label>

                <input
                  type="time"
                  value={
                    form.collegeWork.startTime
                  }
                  onChange={(e) =>
                    handleNestedChange(
                      'collegeWork',
                      'startTime',
                      e.target.value
                    )
                  }
                />

              </div>


              <div className="day-profile-field">

                <label>
                  End time
                </label>

                <input
                  type="time"
                  value={
                    form.collegeWork.endTime
                  }
                  onChange={(e) =>
                    handleNestedChange(
                      'collegeWork',
                      'endTime',
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          )}

        </section>


        {/* =========================================
            COMMUTE
        ========================================= */}

        <section className="day-profile-section">

          <div className="day-profile-section-heading">

            <span>03</span>

            <div>
              <p>TRAVEL</p>

              <h2>
                Your commute
              </h2>

              <small>
                Travel time should not be treated
                as freely available time.
              </small>
            </div>

          </div>


          <label className="day-profile-toggle">

            <input
              type="checkbox"
              checked={
                form.commute.enabled
              }
              onChange={(e) =>
                handleNestedChange(
                  'commute',
                  'enabled',
                  e.target.checked
                )
              }
            />

            <span>
              I have regular commute / travel
            </span>

          </label>


          {form.commute.enabled && (

            <div className="day-profile-field">

              <label>
                Total commute time per day
                (minutes)
              </label>

              <input
                type="number"
                min="0"
                value={
                  form.commute.durationMinutes
                }
                onChange={(e) =>
                  handleNestedChange(
                    'commute',
                    'durationMinutes',
                    e.target.value
                  )
                }
                placeholder="Example: 60"
              />

            </div>

          )}

        </section>


        {/* =========================================
            MEALS
        ========================================= */}

        <section className="day-profile-section">

          <div className="day-profile-section-heading">

            <span>04</span>

            <div>
              <p>MEALS</p>

              <h2>
                Your usual meal timings
              </h2>

              <small>
                These help us place activities around
                your existing routine.
              </small>
            </div>

          </div>


          <div className="day-profile-grid">

            <div className="day-profile-field">

              <label>
                Breakfast
              </label>

              <input
                type="time"
                value={
                  form.meals.breakfast
                }
                onChange={(e) =>
                  handleNestedChange(
                    'meals',
                    'breakfast',
                    e.target.value
                  )
                }
              />

            </div>


            <div className="day-profile-field">

              <label>
                Lunch
              </label>

              <input
                type="time"
                value={
                  form.meals.lunch
                }
                onChange={(e) =>
                  handleNestedChange(
                    'meals',
                    'lunch',
                    e.target.value
                  )
                }
              />

            </div>


            <div className="day-profile-field">

              <label>
                Dinner
              </label>

              <input
                type="time"
                value={
                  form.meals.dinner
                }
                onChange={(e) =>
                  handleNestedChange(
                    'meals',
                    'dinner',
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </section>


        {/* =========================================
            EXERCISE
        ========================================= */}

        <section className="day-profile-section">

          <div className="day-profile-section-heading">

            <span>05</span>

            <div>
              <p>MOVEMENT</p>

              <h2>
                Exercise or gym
              </h2>

              <small>
                If you already exercise, we will
                work around that commitment.
              </small>
            </div>

          </div>


          <label className="day-profile-toggle">

            <input
              type="checkbox"
              checked={
                form.exercise.enabled
              }
              onChange={(e) =>
                handleNestedChange(
                  'exercise',
                  'enabled',
                  e.target.checked
                )
              }
            />

            <span>
              I currently exercise / go to the gym
            </span>

          </label>


          {form.exercise.enabled && (

            <div className="day-profile-grid">

              <div className="day-profile-field">

                <label>
                  Preferred exercise time
                </label>

                <input
                  type="time"
                  value={
                    form.exercise.preferredTime
                  }
                  onChange={(e) =>
                    handleNestedChange(
                      'exercise',
                      'preferredTime',
                      e.target.value
                    )
                  }
                />

              </div>


              <div className="day-profile-field">

                <label>
                  Duration (minutes)
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    form.exercise.durationMinutes
                  }
                  onChange={(e) =>
                    handleNestedChange(
                      'exercise',
                      'durationMinutes',
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          )}

        </section>


        {/* =========================================
            PRODUCTIVE TIME
        ========================================= */}

        <section className="day-profile-section">

          <div className="day-profile-section-heading">

            <span>06</span>

            <div>
              <p>AVAILABLE TIME</p>

              <h2>
                How much time do you have?
              </h2>

              <small>
                We will use this to avoid creating
                an unrealistic routine.
              </small>
            </div>

          </div>


          <div className="day-profile-grid">

            <div className="day-profile-field">

              <label>
                Study / focused work hours
              </label>

              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={
                  form.studyHours
                }
                onChange={(e) =>
                  handleChange(
                    'studyHours',
                    e.target.value
                  )
                }
              />

            </div>


            <div className="day-profile-field">

              <label>
                Relaxation time (minutes)
              </label>

              <input
                type="number"
                min="0"
                value={
                  form.relaxationTime
                }
                onChange={(e) =>
                  handleChange(
                    'relaxationTime',
                    e.target.value
                  )
                }
              />

            </div>


            <div className="day-profile-field">

              <label>
                Flexible time (minutes)
              </label>

              <input
                type="number"
                min="0"
                value={
                  form.flexibleTime
                }
                onChange={(e) =>
                  handleChange(
                    'flexibleTime',
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </section>


        {/* =========================================
            RESPONSIBILITIES
        ========================================= */}

        <section className="day-profile-section">

          <div className="day-profile-section-heading">

            <span>07</span>

            <div>
              <p>REAL LIFE</p>

              <h2>
                Responsibilities & commitments
              </h2>

              <small>
                Tell us about things the planner
                needs to respect.
              </small>
            </div>

          </div>


          <div className="day-profile-field">

            <label>
              Personal responsibilities
            </label>

            <textarea
              value={
                form.personalResponsibilities
              }
              onChange={(e) =>
                handleChange(
                  'personalResponsibilities',
                  e.target.value
                )
              }
              placeholder="Example: family responsibilities, household work, personal tasks..."
              rows="4"
            />

          </div>


          <div className="day-profile-field">

            <label>
              Fixed commitments
            </label>

            <textarea
              value={
                form.fixedCommitments
              }
              onChange={(e) =>
                handleChange(
                  'fixedCommitments',
                  e.target.value
                )
              }
              placeholder="Example: tuition, meetings, prayer, coaching, appointments..."
              rows="4"
            />

          </div>

        </section>


        {/* =========================================
            MESSAGE
        ========================================= */}

        {message && (
          <div className="day-profile-success">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="day-profile-error">
            ! {error}
          </div>
        )}


        {/* =========================================
            SUBMIT
        ========================================= */}

        <div className="day-profile-submit">

          <div>

            <strong>
              Ready to personalize your day?
            </strong>

            <p>
              Your information will become the
              foundation for your personalized
              daily planning system.
            </p>

          </div>


          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? 'Saving your day...'
              : 'Save My Day →'}
          </button>

        </div>

      </form>


      {/* =========================================
          DISCLAIMER
      ========================================= */}

      <div className="day-profile-disclaimer">

        <span>ⓘ</span>

        <p>
          Your captured routine is used to organize
          personalized wellness guidance. It does not
          replace professional medical advice.
        </p>

      </div>

    </div>
  );
}