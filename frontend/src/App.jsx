import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Leaderboard from './components/Leaderboard';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

// Debug component to log route changes
const RouteDebugger = () => {
  const location = useLocation();
  // #region agent log
  React.useEffect(() => {
    console.log('[DEBUG] Route changed to:', location.pathname);
  }, [location]);
  // #endregion
  return null;
};

function App() {
  return (
    <Router>
      <RouteDebugger />
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
