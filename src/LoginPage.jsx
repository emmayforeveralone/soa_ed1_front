// src/pages/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'; // Asegúrate de importar el archivo de estilos

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
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Iniciar sesión</h1>

        <label>Rol</label>
        <select value={role} onChange={e => setRole(e.target.value)} className="form-input">
          <option value="">Selecciona un rol</option>
          <option value="PROFESOR">Profesor</option>
          <option value="ESTUDIANTE">Estudiante</option>
        </select>

        <label>Institución</label>
        <select value={tenantId} onChange={e => setTenantId(e.target.value)} className="form-input">
          <option value="">Selecciona una institución</option>
          {tenants.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <label>Usuario</label>
        <select value={userId} onChange={e => setUserId(e.target.value)} className="form-input">
          <option value="">Selecciona tu usuario</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.username}</option>
          ))}
        </select>

        <button onClick={handleLogin} className="btn-primary">Entrar</button>
      </div>
    </div>
  );
}

export default LoginPage;
