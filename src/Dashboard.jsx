// src/pages/Dashboard.jsx
import React from 'react';
import ProjectList from './ProjectList';
import TaskList from './TaskList';

function Dashboard({ auth }) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1 className="dashboard-title">
          Bienvenido, <span className="highlight">{auth.role}</span>
        </h1>

        {auth.role === 'PROFESOR' && (
          <>
            <ProjectList auth={auth} />
            <TaskList auth={auth} />
          </>
        )}

        {auth.role === 'ESTUDIANTE' && <TaskList auth={auth} />}
      </div>
    </div>
  );
}

export default Dashboard;
