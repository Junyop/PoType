import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import TypeCalculator from './features/typeCalculator/TypeCalculator';
import TeamBuilder from './features/teamBuilder/TeamBuilder';
import Navbar from './components/Navbar';
import ModeToggle from './components/ModeToggle';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <ModeToggle />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/calculator" replace />} />
            <Route path="/calculator" element={<TypeCalculator />} />
            <Route path="/team" element={<TeamBuilder />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
