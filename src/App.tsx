import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Add more routes here as you create them */}
        <Route path="/login" element={<div className="min-h-screen flex items-center justify-center"><p>Login page coming soon...</p></div>} />
        <Route path="/signup" element={<div className="min-h-screen flex items-center justify-center"><p>Sign up page coming soon...</p></div>} />
      </Routes>
    </Router>
  );
}

export default App;
