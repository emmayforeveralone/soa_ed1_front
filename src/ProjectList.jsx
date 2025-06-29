// src/components/ProjectList.jsx
import React, { useEffect, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from './projects';

function ProjectList({ auth }) {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', description: '' });

  const loadProjects = () => {
    getProjects(auth).then(setProjects).catch(() => alert('Error al cargar proyectos'));
  };

  useEffect(() => {
    if (auth.role === 'PROFESOR') loadProjects();
  }, [auth]);

  const handleCreate = () => {
    if (!newProject.name) return alert('Nombre requerido');
    const project = {
      ...newProject,
      leader: { id: parseInt(auth.userId) },
      tenant: { id: parseInt(auth.tenantId) }
    };
    createProject(auth, project)
      .then(() => {
        setNewProject({ name: '', description: '' });
        loadProjects();
      })
      .catch(() => alert('Error al crear proyecto'));
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setEditData({ name: project.name, description: project.description });
  };

  const handleUpdate = (project) => {
    const updated = {
      ...project,
      name: editData.name,
      description: editData.description,
      leader: project.leader,
      tenant: project.tenant
    };
    updateProject(auth, project.id, updated)
      .then(() => {
        setEditingId(null);
        loadProjects();
      })
      .catch(() => alert('Error al actualizar'));
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este proyecto?')) return;
    deleteProject(auth, id).then(loadProjects).catch(() => alert('Error al eliminar proyecto'));
  };

  return (
    <div className="section-box">
      <h2>Proyectos</h2>
      <ul>
        {projects.map(p => (
          <li key={p.id} className="card">
            {editingId === p.id ? (
              <>
                <input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                <input value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} />
                <button className="btn-primary" onClick={() => handleUpdate(p)}>Guardar</button>
                <button className="btn-delete" onClick={() => setEditingId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <strong>{p.name}</strong><br />
                {p.description}
                <div style={{ marginTop: '10px' }}>
                  <button className="btn-edit" onClick={() => startEdit(p)}>Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(p.id)}>Eliminar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <h3>Nuevo proyecto</h3>
      <input placeholder="Nombre del proyecto" value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} />
      <input placeholder="Descripción" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
      <button className="btn-primary" onClick={handleCreate}>Crear</button>
    </div>
  );
}

export default ProjectList;