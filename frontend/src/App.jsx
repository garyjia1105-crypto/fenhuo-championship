import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Leaderboard from './components/Leaderboard';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Router>
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
