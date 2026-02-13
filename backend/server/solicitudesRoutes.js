import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const solicitudesPath = path.join(__dirname, "data", "solicitudesEmpleo.json");

// Configuración de multer para guardar fotos de candidatos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-candidato-" + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Helper para leer solicitudes
const leerSolicitudes = () => {
  try {
    const data = fs.readFileSync(solicitudesPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo solicitudes:", error);
    return [];
  }
};

// Helper para escribir solicitudes
const escribirSolicitudes = (solicitudes) => {
  try {
    fs.writeFileSync(solicitudesPath, JSON.stringify(solicitudes, null, 2));
    return true;
  } catch (error) {
    console.error("Error escribiendo solicitudes:", error);
    return false;
  }
};

// GET - Obtener todas las solicitudes
router.get("/", (req, res) => {
  const solicitudes = leerSolicitudes();
  res.json(solicitudes);
});

// POST - Crear nueva solicitud
router.post("/", upload.single("foto"), (req, res) => {
  try {
    const { nombre, apellidos, email, telefono, direccion, provincia, municipio } = req.body;
    
    const solicitudes = leerSolicitudes();
    
    const nuevaSolicitud = {
      id: Date.now(),
      nombre,
      apellidos,
      email,
      telefono,
      direccion,
      provincia,
      municipio,
      foto: req.file ? `/uploads/${req.file.filename}` : null,
      fechaSolicitud: new Date().toISOString(),
    };

    solicitudes.push(nuevaSolicitud);
    
    if (escribirSolicitudes(solicitudes)) {
      res.status(201).json(nuevaSolicitud);
    } else {
      res.status(500).json({ error: "Error al guardar la solicitud" });
    }
  } catch (error) {
    console.error("Error al crear solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE - Eliminar solicitud por ID
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let solicitudes = leerSolicitudes();
    
    const index = solicitudes.findIndex((s) => s.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    // Eliminar foto del servidor si existe
    const solicitud = solicitudes[index];
    if (solicitud.foto) {
      const fotoPath = path.join(__dirname, solicitud.foto.replace(/^\//, ""));
      if (fs.existsSync(fotoPath)) {
        fs.unlinkSync(fotoPath);
      }
    }

    solicitudes.splice(index, 1);
    
    if (escribirSolicitudes(solicitudes)) {
      res.json({ message: "Solicitud eliminada correctamente" });
    } else {
      res.status(500).json({ error: "Error al eliminar la solicitud" });
    }
  } catch (error) {
    console.error("Error al eliminar solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
