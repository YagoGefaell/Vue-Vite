import axios from "axios";

const API_URL = "http://localhost:5000/api/reservas";

export const getReservas = async (userId, isAdmin) => {
  const res = await axios.get(API_URL, {
    params: { userId, isAdmin },
  });
  return res.data;
};

export const addReserva = async (reservaData) => {
  const res = await axios.post(API_URL, reservaData);
  return res.data;
};

export const updateEstadoReserva = async (id, estado) => {
  const res = await axios.put(`${API_URL}/${id}`, { estado });
  return res.data;
};

export const deleteReserva = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
