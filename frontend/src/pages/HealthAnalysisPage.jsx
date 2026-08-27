import { useNavigate } from 'react-router-dom';
import HealthAnalysis from '../components/HealthAnalysis';

export default function HealthAnalysisPage() {
  const navigate = useNavigate();

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
            onClick={() => navigate('/health')}
          >
            ✏️ Edit Health Profile
          </button>

          <button
            type="button"
            className="health-submit-btn"
            style={{ padding: '10px 20px', fontSize: '14px' }}
            onClick={() => navigate('/health-plan')}
          >
            View 12-Month Plan →
          </button>
        </div>
      </div>

      {/* HEALTH ANALYSIS GRAPHICS & SNAPSHOT */}
      <HealthAnalysis />

      {/* NEXT STEP CTA */}
      <div className="wealth-plan-cta-box" style={{ marginTop: '24px' }}>
        <div className="cta-left">
          <span className="cta-sparkle">🌿</span>
          <div>
            <h3>Ready to Start Your 12-Month Wellness Roadmap?</h3>
            <p>Turn your biometrics and lifestyle profile into structured quarterly goals & daily health checklists.</p>
          </div>
        </div>
        <button
          type="button"
          className="health-submit-btn"
          onClick={() => navigate('/health-plan')}
        >
          View 12-Month Health Plan →
        </button>
      </div>

      {/* DISCLAIMER */}
      <div className="wealth-disclaimer-footer">
        <span>ⓘ</span>
        <p>
          HealthMargdarshi provides wellness guidance and lifestyle organization tools. It does not diagnose medical conditions or replace advice from a qualified healthcare professional.
        </p>
      </div>
    </div>
  );
}