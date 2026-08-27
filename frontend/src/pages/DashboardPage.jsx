import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function DashboardPage() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const [healthProfile, setHealthProfile] = useState(null);
  const [wealthProfile, setWealthProfile] = useState(null);
  const [growthProfile, setGrowthProfile] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [wealthLoading, setWealthLoading] = useState(true);
  const [growthLoading, setGrowthLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =========================================================
     FETCH HEALTH, WEALTH & GROWTH PROFILES
  ========================================================= */

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!token) {
        setHealthLoading(false);
        setWealthLoading(false);
        setGrowthLoading(false);
        return;
      }

      try {
        const [healthRes, wealthRes, growthRes] = await Promise.allSettled([
          api.getHealthProfile(token),
          api.getWealthProfile(token),
          api.getGrowthProfile(token),
        ]);

        if (healthRes.status === 'fulfilled' && healthRes.value?.success) {
          const hp = healthRes.value.data?.healthProfile || healthRes.value.data;
          setHealthProfile(hp && (hp._id || hp.user) ? hp : null);
        } else {
          setHealthProfile(null);
        }

        if (wealthRes.status === 'fulfilled' && wealthRes.value?.success) {
          const wp = wealthRes.value.data?.wealthProfile || wealthRes.value.data;
          setWealthProfile(wp && (wp._id || wp.user) ? wp : null);
        } else {
          setWealthProfile(null);
        }

        if (growthRes.status === 'fulfilled' && growthRes.value?.success) {
          const gp = growthRes.value.data?.growthProfile || growthRes.value.data;
          setGrowthProfile(gp && (gp._id || gp.user) ? gp : null);
        } else {
          setGrowthProfile(null);
        }
      } catch (error) {
        console.error('Dashboard profiles fetch error:', error);
      } finally {
        setHealthLoading(false);
        setWealthLoading(false);
        setGrowthLoading(false);
      }
    };

    fetchProfiles();
  }, [token]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
    navigate('/login');
  };

  /* =========================================================
     NAVIGATION HELPERS
  ========================================================= */

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  /* =========================================================
     DIMENSION METADATA
  ========================================================= */

  const healthCompleted = Boolean(healthProfile);
  const wealthCompleted = Boolean(wealthProfile);
  const growthCompleted = Boolean(growthProfile);

  const dimensions = [
    {
      title: 'HealthMargdarshi',
      visualType: 'health',
      description:
        'Optimize physical, mental, and energy dimensions for balanced daily living.',
      status: healthLoading
        ? 'Checking your profile...'
        : healthCompleted
        ? 'Profile completed'
        : 'Profile not completed',
      action: healthCompleted
        ? 'View Health Profile'
        : 'Set Up Health',
      path: healthCompleted ? '/health-analysis' : '/health',
      className: 'health-card',
      completed: healthCompleted,
    },

    {
      title: 'WealthMargdarshi',
      visualType: 'wealth',
      description:
        'Manage your income, spending and savings intelligently.',
      status: wealthLoading
        ? 'Checking your profile...'
        : wealthCompleted
        ? 'Profile completed'
        : 'Profile not completed',
      action: wealthCompleted
        ? 'View Wealth Profile'
        : 'Set Up Wealth',
      path: wealthCompleted ? '/wealth-analysis' : '/wealth',
      className: 'wealth-card',
      completed: wealthCompleted,
    },

    {
      title: 'GrowthMargdarshi',
      visualType: 'growth',
      description:
        'Build meaningful life skills through structured long-term growth.',
      status: growthLoading
        ? 'Checking your profile...'
        : growthCompleted
        ? 'Growth profile active'
        : 'Profile not completed',
      action: growthCompleted
        ? 'View Growth'
        : 'Set Up Growth',
      path: '/growth',
      className: 'growth-card',
      completed: growthCompleted,
    },
  ];

  /* =========================================================
     PROGRESS
  ========================================================= */

  const completedDimensions = dimensions.filter(
    (dimension) => dimension.completed
  ).length;

  const overallProgress = Math.round(
    (completedDimensions / dimensions.length) * 100
  );

  /* =========================================================
     LIVE VISUALS
  ========================================================= */

  const renderDimensionVisual = (type) => {
    /* =======================================================
       HEALTH
       WARM / PULSE / ORGANIC ENERGY
    ======================================================= */

    if (type === 'health') {
      return (
        <div className="dimension-visual health-visual">
          <div className="health-atmosphere" />

          <div className="health-orbit health-orbit-1" />
          <div className="health-orbit health-orbit-2" />
          <div className="health-orbit health-orbit-3" />

          <div className="health-pulse pulse-1" />
          <div className="health-pulse pulse-2" />
          <div className="health-pulse pulse-3" />

          <div className="health-wave">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="health-core">
            <div className="health-core-inner" />
          </div>

          <div className="health-spark spark-1" />
          <div className="health-spark spark-2" />
          <div className="health-spark spark-3" />
          <div className="health-spark spark-4" />
        </div>
      );
    }

    /* =======================================================
       WEALTH
       COOL / LIQUID / DATA FLOW
    ======================================================= */

    if (type === 'wealth') {
      return (
        <div className="dimension-visual wealth-visual">
          <div className="wealth-atmosphere" />

          <div className="wealth-ring wealth-ring-1">
            <span />
            <span />
          </div>

          <div className="wealth-ring wealth-ring-2">
            <span />
            <span />
          </div>

          <div className="wealth-ring wealth-ring-3">
            <span />
            <span />
          </div>

          <div className="wealth-core">
            <div className="wealth-core-inner">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="wealth-stream stream-1" />
          <div className="wealth-stream stream-2" />
          <div className="wealth-stream stream-3" />

          <div className="wealth-particle wp-1" />
          <div className="wealth-particle wp-2" />
          <div className="wealth-particle wp-3" />
          <div className="wealth-particle wp-4" />
          <div className="wealth-particle wp-5" />
        </div>
      );
    }

    /* =======================================================
       GROWTH
       ASCENDING / NEURAL / EXPANSION
    ======================================================= */

    return (
      <div className="dimension-visual growth-visual">
        <div className="growth-atmosphere" />

        <div className="growth-grid">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="growth-trail">
          <span className="growth-node gn-1" />
          <span className="growth-node gn-2" />
          <span className="growth-node gn-3" />
          <span className="growth-node gn-4" />
          <span className="growth-node gn-5" />
        </div>

        <div className="growth-branch gb-1" />
        <div className="growth-branch gb-2" />
        <div className="growth-branch gb-3" />
        <div className="growth-branch gb-4" />

        <div className="growth-core">
          <div className="growth-core-inner" />
        </div>

        <div className="growth-particle gp-1" />
        <div className="growth-particle gp-2" />
        <div className="growth-particle gp-3" />
        <div className="growth-particle gp-4" />
        <div className="growth-particle gp-5" />
      </div>
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="dashboard-page">

      {/* =====================================================
          MENU
      ===================================================== */}

      <button
        className="dashboard-menu-button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation menu"
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

      {/* =====================================================
          OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          className="dashboard-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen ? 'sidebar-open' : ''
        }`}
      >
        <div className="sidebar-top">

          <div className="brand">
            <div className="brand-symbol">
              M
            </div>

            <div>
              <h2>MeraApnaMargdarshi</h2>
              <span>Personal Life Guide</span>
            </div>
          </div>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            type="button"
            aria-label="Close navigation menu"
          >
            ×
          </button>
        </div>

        <nav className="sidebar-nav">

          <button
            className="nav-item active"
            onClick={() => goTo('/dashboard')}
            type="button"
          >
            <span className="nav-symbol dashboard-symbol">
              ◇
            </span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => goTo(healthProfile ? '/health-analysis' : '/health')}
            type="button"
          >
            <span className="nav-symbol health-nav-symbol">
              🌿
            </span>
            HealthMargdarshi
          </button>

          <button
            className="nav-item"
            onClick={() => goTo(wealthProfile ? '/wealth-analysis' : '/wealth')}
            type="button"
          >
            <span className="nav-symbol wealth-nav-symbol">
              💎
            </span>
            WealthMargdarshi
          </button>

          <button
            className="nav-item"
            onClick={() => goTo('/growth')}
            type="button"
          >
            <span className="nav-symbol growth-nav-symbol">
              🔮
            </span>
            GrowthMargdarshi
          </button>

          <button
            className="nav-item"
            onClick={() => goTo('/daily-plan')}
            type="button"
          >
            <span className="nav-symbol">
              📋
            </span>
            My Journey
          </button>

          <button
            className="nav-item"
            onClick={() => goTo('/day-profile')}
            type="button"
          >
            <span className="nav-symbol">
              👤
            </span>
            Profile
          </button>

        </nav>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
          type="button"
        >
          <span>↪</span>
          Logout
        </button>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="dashboard-main">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="dashboard-header">

          <div className="dashboard-header-content">

            <p className="dashboard-eyebrow">
              YOUR PERSONAL LIFE GUIDE
            </p>

            <h1>
              Good Morning, {user?.name || 'User'}
            </h1>

            <p className="dashboard-subtitle">
              Let's make today a meaningful step toward a better you.
            </p>

          </div>

          <div className="profile-badge">

            <div className="profile-avatar">
              {(user?.name || 'U')
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="profile-info">
              <strong>
                {user?.name || 'User'}
              </strong>

              <span>
                Member
              </span>
            </div>

          </div>

        </header>

        {/* ===================================================
            DIMENSIONS
        =================================================== */}

        <section className="dimensions-section">

          <div className="section-heading">

            <div>
              <p className="section-label">
                YOUR THREE DIMENSIONS
              </p>

              <h2>
                Build a balanced life.
              </h2>
            </div>

            <span className="section-note">
              Your journey starts here
            </span>

          </div>

          <div className="dimension-grid">

            {dimensions.map((dimension) => (
              <article
                key={dimension.title}
                className={`dimension-card ${dimension.className} ${
                  dimension.completed
                    ? 'dimension-completed'
                    : ''
                }`}
              >

                {/* LIVE VISUAL */}

                <div className="dimension-visual-container">
                  {renderDimensionVisual(
                    dimension.visualType
                  )}
                </div>

                {/* CONTENT */}

                <div className="dimension-content">

                  <div className="dimension-title-row">

                    <h3>
                      {dimension.title}
                    </h3>

                    {dimension.completed && (
                      <span className="completed-check">
                        ✓
                      </span>
                    )}

                  </div>

                  <p>
                    {dimension.description}
                  </p>

                  <div className="dimension-status">

                    <span
                      className={`status-dot ${
                        dimension.completed
                          ? 'status-completed'
                          : ''
                      }`}
                    />

                    {dimension.status}

                  </div>

                  <button
                    className="dimension-button"
                    onClick={() =>
                      navigate(dimension.path)
                    }
                    type="button"
                  >
                    <span>
                      {dimension.action}
                    </span>

                    <span className="button-arrow">
                      →
                    </span>
                  </button>

                </div>

              </article>
            ))}

          </div>

        </section>

        {/* ===================================================
            LOWER GRID
        =================================================== */}

        <section className="dashboard-lower-grid">

          {/* JOURNEY */}

          <div className="journey-card">

            <div className="card-heading">

              <div>
                <p className="section-label">
                  YOUR JOURNEY
                </p>

                <h2>
                  Overall Progress
                </h2>
              </div>

              <span className="progress-badge">
                {overallProgress}%
              </span>

            </div>

            <p className="card-description">
              {overallProgress === 0
                ? 'Complete your profiles to begin your personalized journey.'
                : overallProgress === 100
                ? 'All three dimensions are complete. Your journey is fully set.'
                : 'Your personalized journey is taking shape.'}
            </p>

            {/* HEALTH */}

            <div className="progress-item">

              <div className="progress-info">
                <span>Health</span>

                <strong>
                  {healthCompleted ? '100%' : '0%'}
                </strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill health-progress"
                  style={{
                    width: healthCompleted
                      ? '100%'
                      : '0%',
                  }}
                />
              </div>

            </div>

            {/* WEALTH */}

            <div className="progress-item">

              <div className="progress-info">
                <span>Wealth</span>

                <strong>{wealthCompleted ? '100%' : '0%'}</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill wealth-progress"
                  style={{ width: wealthCompleted ? '100%' : '0%' }}
                />
              </div>

            </div>

            {/* GROWTH */}

            <div className="progress-item">

              <div className="progress-info">
                <span>Growth</span>

                <strong>{growthCompleted ? '100%' : '0%'}</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill growth-progress"
                  style={{ width: growthCompleted ? '100%' : '0%' }}
                />
              </div>

            </div>

            <div className="progress-summary">

              <div className="summary-dot" />

              <span>
                {completedDimensions} of{' '}
                {dimensions.length}{' '}
                dimensions completed
              </span>

            </div>

          </div>

          {/* TODAY'S GUIDE */}

          <div className="guide-card">

            <div className="guide-glow" />

            <div className="guide-icon">
              ✦
            </div>

            <p className="section-label">
              TODAY'S GUIDE
            </p>

            <h2>
              Your day, guided your way.
            </h2>

            <p>
              Your personalized daily guide will appear here
              once MeraApnaMargdarshi understands your goals,
              routine and priorities.
            </p>

            <button
              className="primary-guide-button"
              onClick={() => navigate('/profile')}
              type="button"
            >
              <span>
                Start My Journey
              </span>

              <span>
                →
              </span>
            </button>

          </div>

        </section>

        {/* ===================================================
            BOTTOM BANNER
        =================================================== */}

        <section className="journey-banner">

          <div className="banner-symbol">
            ◇
          </div>

          <div className="banner-content">

            <p className="section-label">
              THE MARGDARSHI APPROACH
            </p>

            <h2>
              Small actions. Consistent progress. A better life.
            </h2>

            <p>
              Health, wealth and growth are connected.
              Your journey will eventually bring all three
              together into one personalized plan.
            </p>

          </div>

        </section>

      </main>
    </div>
  );
}