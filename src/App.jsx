import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TypeCalculator from './features/typeCalculator/TypeCalculator';
import TeamBuilder from './features/teamBuilder/TeamBuilder';
import Navbar from './components/Navbar';
import ModeToggle from './components/ModeToggle';

function App() {
  return (
    <Router>
      <ModeToggle />

      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/calculator" />} />
        <Route path="/calculator" element={<TypeCalculator />} />
        <Route path="/team" element={<TeamBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;
