// App principal para el frontend del sistema GTPA
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import './styles.css';


function App() {
  const [auth, setAuth] = useState({ role: '', tenantId: '' });

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={auth.role && auth.tenantId ? <Navigate to="/dashboard" /> : <LoginPage setAuth={setAuth} />}
        />
        <Route
          path="/dashboard"
          element={auth.role && auth.tenantId ? <Dashboard auth={auth} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

