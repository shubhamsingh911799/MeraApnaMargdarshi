import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (loading) {
    return (
      <div className="login-loading">
        <div className="login-loading-orb">✦</div>
        <p>Preparing your journey...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError('');

    const response = await login(form);

    if (response.success) {
      navigate('/dashboard');
    } else {
      setError(response.message || 'Unable to sign in.');
    }

    setSubmitting(false);
  };

  return (
    <div className="login-page">

      {/* BACKGROUND EFFECTS */}
      <div className="login-glow login-glow-one"></div>
      <div className="login-glow login-glow-two"></div>
      <div className="login-grid"></div>

      {/* TOP BAR */}
      <header className="login-topbar">

        <Link to="/" className="login-brand">
          <div className="brand-mark">
            ✦
          </div>

          <div>
            <div className="brand-name">
              MeraApna<span>Margdarshi</span>
            </div>

            <div className="brand-subtitle">
              Personal Life Guide
            </div>
          </div>
        </Link>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>

      </header>

      {/* MAIN */}
      <main className="login-main">

        <div className="login-shell">

          {/* LEFT PANEL */}
          <section className="login-intro">

            <div className="journey-tag">
              <span>✦</span>
              YOUR JOURNEY STARTS HERE
            </div>

            <h1>
              Welcome
              <br />
              <span>back.</span>
            </h1>

            <p className="intro-text">
              Continue your journey toward a more balanced,
              disciplined and meaningful life.
            </p>

            {/* DIMENSIONS */}
            <div className="login-dimensions">

              <div className="login-dimension health">
                <div className="dimension-icon">♥</div>

                <div>
                  <strong>Health</strong>
                  <span>Build a stronger you</span>
                </div>

                <b>01</b>
              </div>

              <div className="login-dimension wealth">
                <div className="dimension-icon">₹</div>

                <div>
                  <strong>Wealth</strong>
                  <span>Manage today, secure tomorrow</span>
                </div>

                <b>02</b>
              </div>

              <div className="login-dimension growth">
                <div className="dimension-icon">↗</div>

                <div>
                  <strong>Growth</strong>
                  <span>Learn, improve, achieve</span>
                </div>

                <b>03</b>
              </div>

            </div>

            <div className="login-quote">
              <span>“</span>
              Small actions. Consistent progress. A better life.
            </div>

          </section>

          {/* RIGHT PANEL */}
          <section className="login-form-panel">

            <div className="form-icon">
              ✦
            </div>

            <div className="form-eyebrow">
              ACCOUNT LOGIN
            </div>

            <h2>Welcome back!</h2>

            <p className="form-description">
              Sign in to continue your personalized journey.
            </p>

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div className="login-field">

                <div className="field-label-row">
                  <label htmlFor="email">
                    Email Address
                  </label>
                </div>

                <div className="input-wrapper">

                  <span className="input-symbol">@</span>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div className="login-field">

                <div className="field-label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                  <Link to="/login">
                    Forgot password?
                  </Link>

                </div>

                <div className="input-wrapper">

                  <span className="input-symbol">•</span>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? '◉' : '○'}
                  </button>

                </div>

              </div>

              {/* ERROR */}
              {error && (
                <div className="login-error">
                  <span>!</span>
                  {error}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={submitting}
                className="login-submit"
              >
                <span>
                  {submitting ? 'Signing in...' : 'Sign In'}
                </span>

                <b>→</b>
              </button>

            </form>

            {/* REGISTER */}
            <div className="create-account">
              Don't have an account?
              <Link to="/register">
                Create Account
              </Link>
            </div>

            <div className="security-note">
              <span>▣</span>
              Your information is securely protected.
            </div>

          </section>

        </div>

      </main>

    </div>
  );
}