// authApi.js
import axios from "axios";

// Función que llama al backend para login usando JWT real
export const loginUsuario = async (dni, password) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      dni,
      password
    });
    return response.data; // { token, nombre, tipo }
  } catch (error) {
    console.error("Error en loginUsuario:", error);
    throw error;
  }
};

// Función que verifica si el usuario es admin mediante el token
export const esAdmin = async () => {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) return { isAdmin: false };

    const response = await axios.get("http://localhost:5000/api/auth/check-admin", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data; // { isAdmin, tipo, dni }
  } catch (error) {
    console.error("Error en checkAdmin:", error);
    return { isAdmin: false };
  }
}
