// src/components/TaskList.jsx
import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask, updateTaskStatus } from './tasks';

function TaskList({ auth }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '', description: '', dueDate: '', priority: 'MEDIA',
    assignedUser: { id: '' }, project: { id: '' }
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const loadTasks = () => {
    const params = auth.role === 'ESTUDIANTE' ? { userId: auth.userId } : {};
    getTasks(auth, params).then(setTasks).catch(() => alert('Error al cargar tareas'));
  };

  useEffect(() => { loadTasks(); }, [auth]);

  const handleCreate = () => {
    const task = { ...newTask, status: 'PENDIENTE', tenant: { id: parseInt(auth.tenantId) } };
    createTask(auth, task).then(() => {
      setNewTask({ title: '', description: '', dueDate: '', priority: 'MEDIA', assignedUser: { id: '' }, project: { id: '' } });
      loadTasks();
    }).catch(() => alert('Error al crear tarea'));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditData({
      title: task.title, description: task.description, dueDate: task.dueDate,
      priority: task.priority, assignedUser: { id: task.assignedUser?.id || '' },
      project: { id: task.project?.id || '' }, status: task.status, tenant: task.tenant
    });
  };

  const handleUpdate = (task) => {
    const updated = { ...task, ...editData };
    updateTask(auth, task.id, updated).then(() => {
      setEditingId(null); loadTasks();
    }).catch(() => alert('Error al actualizar tarea'));
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar esta tarea?')) return;
    deleteTask(auth, id).then(loadTasks).catch(() => alert('Error al eliminar'));
  };

  const handleStatusChange = (taskId, currentStatus) => {
    const next = { PENDIENTE: 'EN_PROGRESO', EN_PROGRESO: 'COMPLETADA' }[currentStatus];
    if (!next) return;
    updateTaskStatus(auth, taskId, next).then(loadTasks).catch(() => alert('Error al cambiar estado'));
  };

  return (
    <div className="section-box">
      <h2>Tareas</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="card">
            {editingId === task.id ? (
              <>
                <input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} />
                <input value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} />
                <input type="date" value={editData.dueDate} onChange={e => setEditData({ ...editData, dueDate: e.target.value })} />
                <input placeholder="ID usuario" value={editData.assignedUser.id} onChange={e => setEditData({ ...editData, assignedUser: { id: e.target.value } })} />
                <input placeholder="ID proyecto" value={editData.project.id} onChange={e => setEditData({ ...editData, project: { id: e.target.value } })} />
                <select value={editData.priority} onChange={e => setEditData({ ...editData, priority: e.target.value })}>
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                </select>
                <button className="btn-primary" onClick={() => handleUpdate(task)}>Guardar</button>
                <button className="btn-delete" onClick={() => setEditingId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <strong>{task.title}</strong><br />
                {task.description}<br />
                Estado: {task.status} — Vence: {task.dueDate}
                <div style={{ marginTop: '10px' }}>
                  {auth.role === 'ESTUDIANTE' && task.status !== 'COMPLETADA' && (
                    <button className="btn-primary" onClick={() => handleStatusChange(task.id, task.status)}>
                      Cambiar a {task.status === 'PENDIENTE' ? 'EN PROGRESO' : 'COMPLETADA'}
                    </button>
                  )}
                  {auth.role === 'PROFESOR' && (
                    <>
                      <button className="btn-edit" onClick={() => startEdit(task)}>Editar</button>
                      <button className="btn-delete" onClick={() => handleDelete(task.id)}>Eliminar</button>
                    </>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {auth.role === 'PROFESOR' && (
        <>
          <h3>Nueva tarea</h3>
          <input placeholder="Título" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
          <input placeholder="Descripción" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
          <input type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
          <input placeholder="ID del usuario" value={newTask.assignedUser.id} onChange={e => setNewTask({ ...newTask, assignedUser: { id: e.target.value } })} />
          <input placeholder="ID del proyecto" value={newTask.project.id} onChange={e => setNewTask({ ...newTask, project: { id: e.target.value } })} />
          <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
          </select>
          <button className="btn-primary" onClick={handleCreate}>Crear</button>
        </>
      )}
    </div>
  );
}

export default TaskList;