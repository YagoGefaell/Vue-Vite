import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Articulo from "../modelos/Articulo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const dbPath = path.join(__dirname, "data", "db.json");

// Helper para leer toda la base de datos
const leerDB = () => {
  try {
    const data = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo db.json:", error);
    return { reservas: [] };
  }
};

// Helper para escribir en la base de datos
const escribirDB = (db) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    return true;
  } catch (error) {
    console.error("Error escribiendo db.json:", error);
    return false;
  }
};

// Helper para leer reservas
const leerReservas = () => {
  const db = leerDB();
  return db.reservas || [];
};

// Helper para escribir reservas
const escribirReservas = (reservas) => {
  const db = leerDB();
  db.reservas = reservas;
  return escribirDB(db);
};

// GET - Obtener todas las reservas (admin) o solo las del usuario
router.get("/", (req, res) => {
  try {
    const { userId, isAdmin } = req.query;
    let reservas = leerReservas();

    // Si no es admin, filtrar solo las reservas del usuario
    if (isAdmin !== "true" && userId) {
      reservas = reservas.filter((r) => r.usuarioId === userId);
    }

    res.json(reservas);
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    res.status(500).json({ error: "Error al obtener reservas" });
  }
});

// POST - Crear nueva reserva
router.post("/", async (req, res) => {
  try {
    const {
      vehiculoId,
      nombreVehiculo,
      usuarioId,
      usuarioNombre,
      usuarioEmail,
      fechaInicio,
      fechaFin,
    } = req.body;

    // Verificar que el vehículo existe y está disponible
    const vehiculo = await Articulo.findById(vehiculoId);
    if (!vehiculo) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }

    if (vehiculo.estado === "reservado") {
      return res.status(400).json({ error: "El vehículo ya está reservado" });
    }

    if (vehiculo.estado === "vendido") {
      return res.status(400).json({ error: "El vehículo ya está vendido" });
    }

    const reservas = leerReservas();

    const nuevaReserva = {
      id: Date.now(),
      vehiculoId,
      nombreVehiculo,
      usuarioId,
      usuarioNombre,
      usuarioEmail,
      fechaInicio,
      fechaFin,
      estado: "pendiente",
      fechaCreacion: new Date().toISOString(),
    };

    reservas.push(nuevaReserva);

    if (escribirReservas(reservas)) {
      // Cambiar estado del vehículo a reservado
      vehiculo.estado = "reservado";
      await vehiculo.save();

      res.status(201).json(nuevaReserva);
    } else {
      res.status(500).json({ error: "Error al guardar la reserva" });
    }
  } catch (error) {
    console.error("Error al crear reserva:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT - Actualizar estado de reserva
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { estado } = req.body;

    let reservas = leerReservas();
    const index = reservas.findIndex((r) => r.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    const reserva = reservas[index];
    reserva.estado = estado;

    // Si la reserva se cancela, liberar el vehículo
    if (estado === "cancelada") {
      const vehiculo = await Articulo.findById(reserva.vehiculoId);
      if (vehiculo && vehiculo.estado === "reservado") {
        vehiculo.estado = "disponible";
        await vehiculo.save();
      }
    }

    reservas[index] = reserva;

    if (escribirReservas(reservas)) {
      res.json(reserva);
    } else {
      res.status(500).json({ error: "Error al actualizar la reserva" });
    }
  } catch (error) {
    console.error("Error al actualizar reserva:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE - Eliminar reserva
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let reservas = leerReservas();

    const index = reservas.findIndex((r) => r.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    const reserva = reservas[index];

    // Liberar el vehículo si estaba reservado
    const vehiculo = await Articulo.findById(reserva.vehiculoId);
    if (vehiculo && vehiculo.estado === "reservado") {
      vehiculo.estado = "disponible";
      await vehiculo.save();
    }

    reservas.splice(index, 1);

    if (escribirReservas(reservas)) {
      res.json({ message: "Reserva eliminada correctamente" });
    } else {
      res.status(500).json({ error: "Error al eliminar la reserva" });
    }
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
