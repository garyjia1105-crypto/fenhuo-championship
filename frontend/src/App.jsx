import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Leaderboard from './components/Leaderboard';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

// Fix for /index.html redirect issue - sync React Router with actual browser URL
const RouteSync = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // #region agent log
    console.log('[DEBUG] Route changed to:', location.pathname, 'Browser URL:', window.location.pathname);
    // #endregion
    
    // If React Router thinks we're at /index.html but browser URL is different, fix it
    if (location.pathname === '/index.html') {
      const browserPath = window.location.pathname;
      // #region agent log
      console.log('[DEBUG] Detected /index.html in React Router, browser is at:', browserPath);
      // #endregion
      if (browserPath !== '/index.html' && browserPath !== '/') {
        navigate(browserPath, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      return;
    }
    
    // If browser URL doesn't match React Router path, sync them
    const browserPath = window.location.pathname;
    if (browserPath !== location.pathname && browserPath !== '/index.html') {
      // #region agent log
      console.log('[DEBUG] Syncing React Router to browser URL:', browserPath);
      // #endregion
      navigate(browserPath, { replace: true });
    }
  }, [location, navigate]);
  
  return null;
};

function App() {
  return (
    <Router>
      <RouteSync />
      <Routes>
        <Route path="/" element={<Leaderboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
