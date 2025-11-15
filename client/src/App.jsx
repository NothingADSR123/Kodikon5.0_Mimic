import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage';
import MimicDashboard from './components/dashboard/MimicDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/mimic-dashboard" element={<MimicDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;