// src/components/TaskList.jsx
import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask, updateTaskStatus } from './tasks';

function TaskList({ auth }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIA',
    assignedUser: { id: '' },
    project: { id: '' }
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const loadTasks = () => {
    const params = auth.role === 'ESTUDIANTE' ? { userId: auth.userId } : {};
    getTasks(auth, params)
      .then(setTasks)
      .catch(() => alert('Error al cargar tareas'));
  };

  useEffect(() => {
    loadTasks();
  }, [auth]);

  const handleCreate = () => {
    const task = {
      ...newTask,
      status: 'PENDIENTE',
      tenant: { id: parseInt(auth.tenantId) }
    };
    createTask(auth, task)
      .then(() => {
        setNewTask({
          title: '',
          description: '',
          dueDate: '',
          priority: 'MEDIA',
          assignedUser: { id: '' },
          project: { id: '' }
        });
        loadTasks();
      })
      .catch(() => alert('Error al crear tarea'));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      assignedUser: { id: task.assignedUser?.id || '' },
      project: { id: task.project?.id || '' },
      status: task.status,
      tenant: task.tenant
    });
  };

  const handleUpdate = (task) => {
    const updated = {
      ...task,
      ...editData
    };
    updateTask(auth, task.id, updated)
      .then(() => {
        setEditingId(null);
        loadTasks();
      })
      .catch(() => alert('Error al actualizar tarea'));
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar esta tarea?')) return;
    deleteTask(auth, id)
      .then(() => loadTasks())
      .catch(() => alert('Error al eliminar'));
  };

  const handleStatusChange = (taskId, currentStatus) => {
    const next = {
      PENDIENTE: 'EN_PROGRESO',
      EN_PROGRESO: 'COMPLETADA'
    }[currentStatus];
    if (!next) return;
    updateTaskStatus(auth, taskId, next)
      .then(() => loadTasks())
      .catch(() => alert('Error al cambiar estado'));
  };

  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold mb-2">Tareas</h2>

      <ul className="mb-4">
        {tasks.map(task => (
          <li key={task.id} className="border p-2 mb-2 rounded bg-gray-100">
            {editingId === task.id ? (
              <div>
                <input className="border p-1 mb-1 w-full" placeholder="Título"
                  value={editData.title}
                  onChange={e => setEditData({ ...editData, title: e.target.value })}
                />
                <input className="border p-1 mb-1 w-full" placeholder="Descripción"
                  value={editData.description}
                  onChange={e => setEditData({ ...editData, description: e.target.value })}
                />
                <input type="date" className="border p-1 mb-1 w-full"
                  value={editData.dueDate}
                  onChange={e => setEditData({ ...editData, dueDate: e.target.value })}
                />
                <input className="border p-1 mb-1 w-full" placeholder="ID usuario"
                  value={editData.assignedUser.id}
                  onChange={e => setEditData({ ...editData, assignedUser: { id: e.target.value } })}
                />
                <input className="border p-1 mb-1 w-full" placeholder="ID proyecto"
                  value={editData.project.id}
                  onChange={e => setEditData({ ...editData, project: { id: e.target.value } })}
                />
                <select className="border p-1 mb-2 w-full"
                  value={editData.priority}
                  onChange={e => setEditData({ ...editData, priority: e.target.value })}
                >
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                </select>
                <button className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleUpdate(task)}>
                  Guardar
                </button>
                <button className="bg-gray-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditingId(null)}>
                  Cancelar
                </button>
              </div>
            ) : (
              <div>
                <strong>{task.title}</strong><br />
                {task.description}<br />
                Estado: {task.status} — Vence: {task.dueDate}

                {auth.role === 'ESTUDIANTE' && task.status !== 'COMPLETADA' && (
                  <div className="mt-2">
                    <button
                      onClick={() => handleStatusChange(task.id, task.status)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Cambiar a {task.status === 'PENDIENTE' ? 'EN PROGRESO' : 'COMPLETADA'}
                    </button>
                  </div>
                )}

                {auth.role === 'PROFESOR' && (
                  <div className="mt-2">
                    <button
                      onClick={() => startEdit(task)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      {auth.role === 'PROFESOR' && (
        <div className="mb-4">
          <h3 className="font-bold">Nueva tarea</h3>
          <input className="border p-1 mb-2 w-full" placeholder="Título"
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input className="border p-1 mb-2 w-full" placeholder="Descripción"
            value={newTask.description}
            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          />
          <input type="date" className="border p-1 mb-2 w-full"
            value={newTask.dueDate}
            onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
          />
          <input className="border p-1 mb-2 w-full" placeholder="ID del usuario"
            value={newTask.assignedUser.id}
            onChange={e => setNewTask({ ...newTask, assignedUser: { id: e.target.value } })}
          />
          <input className="border p-1 mb-2 w-full" placeholder="ID del proyecto"
            value={newTask.project.id}
            onChange={e => setNewTask({ ...newTask, project: { id: e.target.value } })}
          />
          <select className="border p-1 mb-2 w-full"
            value={newTask.priority}
            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
          >
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
          </select>
          <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-1 rounded">
            Crear
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskList;
