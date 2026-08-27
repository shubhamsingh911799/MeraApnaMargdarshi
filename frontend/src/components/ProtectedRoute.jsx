import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#08070b',
          color: '#ffffff',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            border: '3px solid rgba(225, 29, 72, 0.25)',
            borderTop: '3px solid #ff4d6d',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p style={{ marginTop: '16px', fontSize: '15px', color: '#ff4d6d', fontWeight: '600' }}>
          Loading MeraApnaMargdarshi...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
