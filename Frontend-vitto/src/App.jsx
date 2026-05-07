import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApplicationForm from './pages/ApplicationForm';
import DecisionResult from './pages/DecisionResult';
import { warmUpBackend } from './api/api';

function App() {
  useEffect(() => {
    warmUpBackend();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ApplicationForm />} />
        <Route path="/result/:id" element={<DecisionResult />} />
      </Routes>
    </Router>
  );
}

export default App;
