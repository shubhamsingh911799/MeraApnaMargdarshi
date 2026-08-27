/* =========================================================
   REALISTIC ANIMATED SVG ICONS WITH AMBIENT GLOW EFFECTS
========================================================= */

// 1. HEALTH VITALITY ICON (Pulsing Heartbeat + ECG Rhythm Wave)
export function HealthVisualIcon({ size = 42, className = "" }) {
  return (
    <div className={`animated-svg-wrapper health-svg-wrapper ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="svg-icon-pulse"
      >
        <defs>
          <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d6d" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
          <filter id="healthGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Ring */}
        <circle cx="32" cy="32" r="28" stroke="url(#healthGrad)" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="4 4" className="svg-spin-ring" />

        {/* Pulse Heart */}
        <path
          d="M32 52C32 52 10 38.5 10 24.5C10 17.5 15.5 12 22.5 12C26.5 12 30 14 32 17C34 14 37.5 12 41.5 12C48.5 12 54 17.5 54 24.5C54 38.5 32 52 32 52Z"
          fill="url(#healthGrad)"
          fillOpacity="0.2"
          stroke="url(#healthGrad)"
          strokeWidth="3"
          filter="url(#healthGlow)"
        />

        {/* ECG Rhythm Wave Line */}
        <path
          d="M16 28H24L27 20L31 36L35 24L38 31H48"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="svg-ecg-line"
        />
      </svg>
    </div>
  );
}

// 2. WEALTH VAULT & GROWTH ICON (Glowing 3D Gem Diamond + Ascending Bar Trend)
export function WealthVisualIcon({ size = 42, className = "" }) {
  return (
    <div className={`animated-svg-wrapper wealth-svg-wrapper ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="svg-icon-float"
      >
        <defs>
          <linearGradient id="wealthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gemTop" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <filter id="wealthGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Hex Shield */}
        <polygon points="32,6 54,18 54,46 32,58 10,46 10,18" stroke="url(#wealthGrad)" strokeWidth="2" strokeOpacity="0.35" className="svg-spin-ring" />

        {/* 3D Diamond Crown */}
        <polygon points="20,20 44,20 52,30 32,50 12,30" fill="url(#wealthGrad)" fillOpacity="0.25" stroke="url(#wealthGrad)" strokeWidth="2.5" filter="url(#wealthGlow)" />
        <polygon points="20,20 44,20 38,30 26,30" fill="url(#gemTop)" />
        <line x1="26" y1="30" x2="32" y2="50" stroke="#6ee7b7" strokeWidth="1.5" />
        <line x1="38" y1="30" x2="32" y2="50" stroke="#6ee7b7" strokeWidth="1.5" />
        <line x1="12" y1="30" x2="52" y2="30" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.8" />
      </svg>
    </div>
  );
}

// 3. GROWTH LIFE-SKILLS ENGINE ICON (Ascending Star + Sprout Evolution)
export function GrowthVisualIcon({ size = 42, className = "" }) {
  return (
    <div className={`animated-svg-wrapper growth-svg-wrapper ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="svg-icon-pulse"
      >
        <defs>
          <linearGradient id="growthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
          <filter id="growthGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbit Ring */}
        <circle cx="32" cy="32" r="26" stroke="url(#growthGrad)" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="6 4" className="svg-spin-ring" />

        {/* Cosmic Diamond Star */}
        <path
          d="M32 10C32 10 35 25 45 28C55 31 55 32 55 32C55 32 45 33 42 43C39 53 32 54 32 54C32 54 29 39 19 36C9 33 9 32 9 32C9 32 19 31 22 21C25 11 32 10 32 10Z"
          fill="url(#growthGrad)"
          fillOpacity="0.3"
          stroke="url(#growthGrad)"
          strokeWidth="2.5"
          filter="url(#growthGlow)"
        />

        {/* Center Flare Core */}
        <circle cx="32" cy="32" r="4" fill="#ffffff" />
      </svg>
    </div>
  );
}

// 4. DAY PROFILE / ROUTINE ICON (24h Circadian Sun-Moon Chronometer)
export function DayProfileVisualIcon({ size = 42, className = "" }) {
  return (
    <div className={`animated-svg-wrapper day-profile-svg-wrapper ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="svg-icon-float"
      >
        <defs>
          <linearGradient id="dayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
          <filter id="dayGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Dial Circle */}
        <circle cx="32" cy="32" r="26" stroke="url(#dayGrad)" strokeWidth="3" filter="url(#dayGlow)" fill="url(#dayGrad)" fillOpacity="0.15" />
        
        {/* Clock Hands */}
        <line x1="32" y1="32" x2="32" y2="18" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        <line x1="32" y1="32" x2="42" y2="32" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="32" r="3" fill="#ffffff" />

        {/* Sun Ray Beams */}
        <circle cx="32" cy="8" r="2" fill="#fbbf24" />
        <circle cx="56" cy="32" r="2" fill="#fbbf24" />
        <circle cx="32" cy="56" r="2" fill="#fbbf24" />
        <circle cx="8" cy="32" r="2" fill="#fbbf24" />
      </svg>
    </div>
  );
}

// 5. DAILY PLAN / CHECKLIST EXECUTION ICON (Radar Target Checklist)
export function DailyPlanVisualIcon({ size = 42, className = "" }) {
  return (
    <div className={`animated-svg-wrapper daily-plan-svg-wrapper ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="svg-icon-pulse"
      >
        <defs>
          <linearGradient id="planGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <filter id="planGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Board Outline */}
        <rect x="12" y="10" width="40" height="46" rx="8" fill="url(#planGrad)" fillOpacity="0.2" stroke="url(#planGrad)" strokeWidth="3" filter="url(#planGlow)" />
        
        {/* Checklist Rows */}
        <line x1="26" y1="22" x2="44" y2="22" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="26" y1="32" x2="44" y2="32" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="26" y1="42" x2="38" y2="42" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

        {/* Checkmarks */}
        <path d="M18 22L20 24L24 20" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 32L20 34L24 30" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="42" r="2.5" fill="#60a5fa" />
      </svg>
    </div>
  );
}

// 6. BODY METRIC SCALE ICON (BMI & VITALITY)
export function BodyProfileIcon({ size = 32, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M24 8V40M12 18H36M12 18L6 30M12 18L18 30M36 18L30 30M36 18L42 30" stroke="#ff4d6d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="8" r="3" fill="#ff4d6d" />
    </svg>
  );
}

// 7. SLEEP / RECOVERY MOON ICON
export function SleepRecoveryIcon({ size = 32, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M34 27C34 33.6274 28.6274 39 22 39C15.3726 39 10 33.6274 10 27C10 20.3726 15.3726 15 22 15C20 18 20 22 22 25C24 28 28 29 31 28C33 27.5 34 27 34 27Z" fill="#34d399" fillOpacity="0.3" stroke="#34d399" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="36,12 38,16 42,16 39,19 40,23 36,20 32,23 33,19 30,16 34,16" fill="#fbbf24" />
    </svg>
  );
}

// 8. ACTIVITY INTENSITY LIGHTNING FLAME ICON
export function ActivityIntensityIcon({ size = 32, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M27 6L13 26H25L21 42L35 22H23L27 6Z" fill="#fbbf24" fillOpacity="0.3" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
