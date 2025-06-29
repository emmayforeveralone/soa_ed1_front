// src/pages/Dashboard.jsx
import React from 'react';
import ProjectList from './ProjectList';
import TaskList from './TaskList';

function Dashboard({ auth }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Bienvenido ({auth.role})</h1>

      {auth.role === 'PROFESOR' && (
        <>
          <ProjectList auth={auth} />
          <TaskList auth={auth} />
        </>
      )}

      {auth.role === 'ESTUDIANTE' && (
        <TaskList auth={auth} />
      )}
    </div>
  );
}

export default Dashboard;
