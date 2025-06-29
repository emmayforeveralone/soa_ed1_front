// src/pages/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LoginPage({ setAuth }) {
  const [role, setRole] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [tenants, setTenants] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/tenants')
      .then(res => setTenants(res.data))
      .catch(() => alert('Error al cargar instituciones'));
  }, []);

  useEffect(() => {
    if (role && tenantId) {
      axios.get('http://localhost:8080/api/users', {
        headers: { 'X-Tenant-ID': tenantId }
      }).then(res => {
        const filtered = res.data.filter(u => u.role === role);
        setUsers(filtered);
      }).catch(() => alert('Error al cargar usuarios'));
    }
  }, [role, tenantId]);

  const handleLogin = () => {
    if (!role || !tenantId || !userId) return alert('Completa todos los campos');
    setAuth({ role, tenantId, userId });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>

      <select value={role} onChange={e => setRole(e.target.value)} className="mb-4 w-full">
        <option value="">Selecciona un rol</option>
        <option value="PROFESOR">Profesor</option>
        <option value="ESTUDIANTE">Estudiante</option>
      </select>

      <select value={tenantId} onChange={e => setTenantId(e.target.value)} className="mb-4 w-full">
        <option value="">Selecciona una institución</option>
        {tenants.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

      <select value={userId} onChange={e => setUserId(e.target.value)} className="mb-4 w-full">
        <option value="">Selecciona tu usuario</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.username}</option>
        ))}
      </select>

      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
        Entrar
      </button>
    </div>
  );
}

export default LoginPage;
