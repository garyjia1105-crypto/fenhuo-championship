import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Leaderboard from './components/Leaderboard';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

// Fix for /index.html redirect issue - try to recover original path from hash or referrer
const RouteSync = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasFixedRef = useRef(false);
  
  useEffect(() => {
    // #region agent log
    console.log('[DEBUG] Route changed to:', location.pathname, 'Browser URL:', window.location.pathname, 'Hash:', window.location.hash, 'Full URL:', window.location.href);
    // #endregion
    
    // If we're at /index.html, try to recover the original path
    if (location.pathname === '/index.html' && !hasFixedRef.current) {
      hasFixedRef.current = true;
      
      // Try to get original path from hash (some servers use this)
      const hashPath = window.location.hash.replace('#', '');
      if (hashPath && hashPath !== '/') {
        // #region agent log
        console.log('[DEBUG] Found path in hash:', hashPath);
        // #endregion
        navigate(hashPath, { replace: true });
        return;
      }
      
      // Try to get from document.referrer (if user came from another page)
      const referrer = document.referrer;
      if (referrer) {
        try {
          const referrerUrl = new URL(referrer);
          const referrerPath = referrerUrl.pathname;
          // #region agent log
          console.log('[DEBUG] Referrer path:', referrerPath);
          // #endregion
          if (referrerPath && referrerPath !== '/' && referrerPath !== '/index.html') {
            navigate(referrerPath, { replace: true });
            return;
          }
        } catch (e) {
          // Invalid referrer URL
        }
      }
      
      // If user directly accessed /admin/login but got redirected to /index.html
      // Check if there's a way to detect the original request
      // For now, redirect to / since we can't recover the path
      // #region agent log
      console.log('[DEBUG] Cannot recover original path, redirecting to /');
      // #endregion
      navigate('/', { replace: true });
      return;
    }
    
    // Reset fix flag if we're not at /index.html anymore
    if (location.pathname !== '/index.html') {
      hasFixedRef.current = false;
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
