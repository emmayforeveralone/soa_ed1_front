// src/api/tasks.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/tasks';

export const getTasks = async (auth, params = {}) => {
  const res = await axios.get(BASE_URL, {
    headers: {
      'X-Role': auth.role,
      'X-Tenant-ID': auth.tenantId
    },
    params
  });
  return res.data;
};

export const createTask = async (auth, task) => {
  const res = await axios.post(BASE_URL, task, {
    headers: {
      'X-Role': auth.role,
      'X-Tenant-ID': auth.tenantId
    }
  });
  return res.data;
};

export const updateTaskStatus = async (auth, taskId, newStatus) => {
  const res = await axios.patch(`${BASE_URL}/${taskId}/status`, {
    status: newStatus
  }, {
    headers: {
      'X-Role': auth.role,
      'X-Tenant-ID': auth.tenantId
    }
  });
  return res.data;
};

export const updateTask = async (auth, id, task) => {
  const res = await axios.put(`http://localhost:8080/api/tasks/${id}`, task, {
    headers: {
      'X-Role': auth.role,
      'X-Tenant-ID': auth.tenantId
    }
  });
  return res.data;
};

export const deleteTask = async (auth, id) => {
  const res = await axios.delete(`http://localhost:8080/api/tasks/${id}`, {
    headers: {
      'X-Role': auth.role,
      'X-Tenant-ID': auth.tenantId
    }
  });
  return res.data;
};
