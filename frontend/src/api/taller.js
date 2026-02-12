import axios from "axios";

const API_URL = "http://localhost:3000/taller";

export async function getCita() {
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    // Aseguramos que siempre sea un array
    if (Array.isArray(res.data)) {
      return res.data;
    } else {
      console.warn("getCita: La API no devolvió un array, usando fallback vacío");
      return [];
    }
  } catch (error) {
    console.error("Error al conseguir las citas:", error);
  }
}

export async function addCita(cita) {
  try {
    const res = await axios.post(API_URL, cita, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    return res.data; // Devuelve el objeto recién creado
  } catch (error) {
    console.error("Error al añadir la cita:", error);
    throw error;
  }
}

export async function deleteCita(id) {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error al borrar la cita:", error);
    throw error;
  }
}

export async function updateCita(id, cita) {
  try {
    const res = await axios.put(`${API_URL}/${id}`, cita, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    throw error;
  }
}
