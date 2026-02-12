import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE}/api/articulos`;

export const getArticulos = () => {
  return axios.get(API_URL)
    .then(res => res.data)
}

export const getArticulosById = (id) => {
  return axios.get(`${API_URL}/${id}`)
    .then(res => res.data)
}

export const addArticulo = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => res.data);
}

export const deleteArticulo = (id) => {
  return axios.delete(`${API_URL}/${id}`)
    .then(res => res.data)
}

export const updateArticulo = (id, articuloActualizado) => {
  return axios.put(`${API_URL}/${id}`, articuloActualizado)
    .then(res => res.data)
}

export const updateEstadoArticulo = (id, estado) => {
  const token = sessionStorage.getItem("token");
  return axios.patch(
    `${API_URL}/${id}`,
    { estado },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((res) => res.data);
};
