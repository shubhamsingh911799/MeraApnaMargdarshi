import { Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

import HealthPage from './pages/HealthPage';
import HealthAnalysisPage from './pages/HealthAnalysisPage';
import HealthPlanPage from './pages/HealthPlanPage';
import WealthPage from './pages/WealthPage';
import WealthAnalysisPage from './pages/WealthAnalysisPage';
import WealthPlanPage from './pages/WealthPlanPage';
import DayProfilePage from './pages/DayProfilePage';
import DailyPlanPage from './pages/DailyPlanPage';

import GrowthPage from './pages/GrowthPage';
import GrowthAssessmentPage from './pages/GrowthAssessmentPage';
import GrowthRoadmapPage from './pages/GrowthRoadmapPage';
import GrowthJourneyPage from './pages/GrowthJourneyPage';
import GrowthProfilePage from './pages/GrowthProfilePage';
import GrowthReflectionPage from './pages/GrowthReflectionPage';

function App() {
  const { isAuthenticated } = useAuth();


  return (

    <Routes>


      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? '/dashboard' : '/login'}
            replace
          />
        }
      />

      {/* =====================================================
          AUTH — LOGIN
      ===================================================== */}

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate 
              to="/dashboard" 
              replace 
            />
          ) : (
            <LoginPage />
          )
        }
      />



      {/* =====================================================
          AUTH — REGISTER
      ===================================================== */}

      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate 
              to="/dashboard" 
              replace 
            />
          ) : (
            <RegisterPage />
          )
        }
      />



      {/* =====================================================
          DASHBOARD
      ===================================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />



      {/* =====================================================
          HEALTHMARGDARSHI — HEALTH PROFILE
      ===================================================== */}

      <Route
        path="/health"
        element={
          <ProtectedRoute>
            <HealthPage />
          </ProtectedRoute>
        }
      />



      {/* =====================================================
          HEALTHMARGDARSHI — HEALTH ANALYSIS
      ===================================================== */}

      <Route
        path="/health-analysis"
        element={
          <ProtectedRoute>
            <HealthAnalysisPage />
          </ProtectedRoute>
        }
      />



      {/* =====================================================
          HEALTHMARGDARSHI — 12 MONTH HEALTH PLAN
      ===================================================== */}

      <Route
        path="/health-plan"
        element={
          <ProtectedRoute>
            <HealthPlanPage />
          </ProtectedRoute>
        }
      />



      {/* =====================================================
          WEALTHMARGDARSHI — WEALTH SETUP
      ===================================================== */}

      <Route
        path="/wealth"
        element={
          <ProtectedRoute>
            <WealthPage />
          </ProtectedRoute>
        }
      />



      {/* =====================================================
          WEALTHMARGDARSHI — WEALTH ANALYSIS
      ===================================================== */}

      <Route
        path="/wealth-analysis"
        element={
          <ProtectedRoute>
            <WealthAnalysisPage />
          </ProtectedRoute>
        }
      />



      {/* =====================================================
          WEALTHMARGDARSHI — 12 MONTH WEALTH PLAN
      ===================================================== */}

      <Route
        path="/wealth-plan"
        element={
          <ProtectedRoute>
            <WealthPlanPage />
          </ProtectedRoute>
        }
      />



      {/* =====================================================
          GROWTHMARGDARSHI MODULE ROUTES
      ===================================================== */}

      <Route
        path="/growth"
        element={
          <ProtectedRoute>
            <GrowthPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/growth/assessment"
        element={
          <ProtectedRoute>
            <GrowthAssessmentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/growth/roadmap"
        element={
          <ProtectedRoute>
            <GrowthRoadmapPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/growth/journey"
        element={
          <ProtectedRoute>
            <GrowthJourneyPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/growth/profile"
        element={
          <ProtectedRoute>
            <GrowthProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/growth/reflection"
        element={
          <ProtectedRoute>
            <GrowthReflectionPage />
          </ProtectedRoute>
        }
      />



      {/* =====================================================
          DAY PROFILE
      ===================================================== */}

      <Route
        path="/day-profile"
        element={
          <ProtectedRoute>
            <DayProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DayProfilePage />
          </ProtectedRoute>
        }
      />



      {/* =====================================================
          DAILY PLAN
      ===================================================== */}

      <Route
        path="/daily-plan"
        element={
          <ProtectedRoute>
            <DailyPlanPage />
          </ProtectedRoute>
        }
      />



      {/* =====================================================
          UNKNOWN ROUTE
      ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to={
              isAuthenticated
                ? '/dashboard'
                : '/login'
            }
            replace
          />
        }
      />


    </Routes>

  );

}


export default App;