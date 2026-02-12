import axios from "axios";

// 🔹 URL base de la API
const API_URL = "http://localhost:3000/clientes";

/* ================================================
   OBTENER CLIENTES
   mostrarHistorico = true → devuelve todos
   mostrarHistorico = false → solo los activos
================================================ */
export const getClientes = async (mostrarHistorico = true) => {
  try {
    const res = await axios.get(API_URL, {
      params: { historico: mostrarHistorico },
    });
    return res.data;
  } catch (error) {
    console.error("Error al cargar clientes", error);
    throw error;
  }
};

/* ================================================
   AÑADIR CLIENTE NUEVO
================================================ */
export const addCliente = async (nuevoCliente) => {
  try {
    const res = await axios.post(API_URL, nuevoCliente);
    return res.data;
  } catch (error) {
    console.error("Error al añadir cliente", error);
    throw error;
  }
};

/* ================================================
   ELIMINAR CLIENTE (marcar historico = false)
   Si quieres eliminar físicamente, usar axios.delete
================================================ */
export const deleteCliente = async (id) => {
  try {
    const res = await axios.patch(`${API_URL}/${id}`, { historico: false });
    return res.data;
  } catch (error) {
    console.error("Error al eliminar cliente", error);
    throw error;
  }
};

/* ================================================
   ACTUALIZAR CLIENTE POR ID
================================================ */
export const updateCliente = async (id, clienteActualizado) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, clienteActualizado);
    return res.data;
  } catch (error) {
    console.error("Error al actualizar cliente", error);
    throw error;
  }
};

/* ================================================
   BUSCAR CLIENTE POR DNI
   Devuelve el primer cliente encontrado o null
================================================ */
export const getClientePorDni = async (dni) => {
  try {
    const res = await axios.get(API_URL, { params: { dni } });
    return res.data.length > 0 ? res.data[0] : null;
  } catch (error) {
    console.error("Error buscando cliente por DNI:", error);
    throw error;
  }
};
