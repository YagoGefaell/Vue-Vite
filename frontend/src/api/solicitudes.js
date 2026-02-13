import axios from "axios";

const API_URL = "http://localhost:5000/api/solicitudes";

export const getSolicitudes = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addSolicitud = async (formData) => {
  const res = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteSolicitud = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
