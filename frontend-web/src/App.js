import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Plans from './pages/Plans';
import Dashboard from './pages/Dashboard';
import Demo from './pages/Demo';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<><Navbar /><Register /></>} />
        <Route path="/plans" element={<><Navbar /><Plans /></>} />
        <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
        <Route path="/demo" element={<><Navbar /><Demo /></>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
