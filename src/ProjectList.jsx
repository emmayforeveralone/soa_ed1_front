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
    deleteProject(auth, id)
      .then(() => loadProjects())
      .catch(() => alert('Error al eliminar proyecto'));
  };

  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold mb-2">Proyectos</h2>

      <ul className="mb-4">
        {projects.map(p => (
          <li key={p.id} className="border p-2 mb-2 rounded bg-gray-100">
            {editingId === p.id ? (
              <div>
                <input
                  className="border p-1 mb-1 w-full"
                  value={editData.name}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                />
                <input
                  className="border p-1 mb-1 w-full"
                  value={editData.description}
                  onChange={e => setEditData({ ...editData, description: e.target.value })}
                />
                <button
                  onClick={() => handleUpdate(p)}
                  className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-400 text-white px-2 py-1 rounded"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div>
                <strong>{p.name}</strong><br />
                {p.description}
                <div className="mt-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="mb-2">
        <h3 className="font-bold mb-1">Nuevo proyecto</h3>
        <input
          className="border p-1 mr-2 mb-2 w-full"
          placeholder="Nombre del proyecto"
          value={newProject.name}
          onChange={e => setNewProject({ ...newProject, name: e.target.value })}
        />
        <input
          className="border p-1 mr-2 mb-2 w-full"
          placeholder="Descripción"
          value={newProject.description}
          onChange={e => setNewProject({ ...newProject, description: e.target.value })}
        />
        <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-1 rounded">
          Crear
        </button>
      </div>
    </div>
  );
}

export default ProjectList;
