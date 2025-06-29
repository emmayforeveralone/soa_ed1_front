// src/api/projects.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/projects';

export const getProjects = async (auth) => {
  const res = await axios.get(BASE_URL, {
    headers: {
      'X-Role': auth.role,
      'X-Tenant-ID': auth.tenantId
    }
  });
  return res.data;
};

export const createProject = async (auth, project) => {
  const res = await axios.post(BASE_URL, project, {
    headers: {
      'X-Role': auth.role,
      'X-Tenant-ID': auth.tenantId
    }
  });
  return res.data;
};

export const updateProject = async (auth, id, project) => {
  const res = await axios.put(`${BASE_URL}/${id}`, project, {
    headers: {
      'X-Role': auth.role,
      'X-Tenant-ID': auth.tenantId
    }
  });
  return res.data;
};

export const deleteProject = async (auth, id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`, {
    headers: {
      'X-Role': auth.role,
      'X-Tenant-ID': auth.tenantId
    }
  });
  return res.data;
};