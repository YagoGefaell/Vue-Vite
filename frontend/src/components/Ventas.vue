<template>
  <div class="container mx-auto my-4 p-4 border rounded-4 shadow-lg bg-light">
    <section class="catalogo-ventas mt-5">
      <h4 class="titulo-seccion">
        <i class="bi bi-cash-coin me-2"></i>Vehículos en Venta
      </h4>

      <div class="row g-3 align-items-end filtro-ventas">
        <div class="col-lg-3 col-md-6">
          <label class="form-label fw-semibold">Marca</label>
          <select v-model="filtroMarca" class="form-select">
            <option value="">Todas las marcas</option>
            <option v-for="marca in marcasUnicas" :key="marca" :value="marca">
              {{ marca }}
            </option>
          </select>
        </div>
        <div class="col-lg-3 col-md-6">
          <label class="form-label fw-semibold">Combustible</label>
          <select v-model="filtroCombustible" class="form-select">
            <option value="">Todos los combustibles</option>
            <option value="gasolina">Gasolina</option>
            <option value="diésel">Diésel</option>
            <option value="híbrido">Híbrido</option>
            <option value="eléctrico">Eléctrico</option>
          </select>
        </div>
        <div class="col-lg-3 col-md-6">
          <label class="form-label fw-semibold">Estado</label>
          <select v-model="filtroEstado" class="form-select">
            <option value="">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
          </select>
        </div>
        <div class="col-lg-3 col-md-6">
          <button class="btn btn-outline-secondary w-100" @click="limpiarFiltros">
            <i class="bi bi-x-circle me-1"></i>Limpiar filtros
          </button>
        </div>
      </div>

      <div class="row g-4 justify-content-left mt-3">
        <div
          class="col-lg-3 col-md-6 col-sm-12"
          v-for="auto in vehiculosFiltrados"
          :key="auto._id || auto.matricula"
        >
          <div class="card card-vehiculo h-100">
            <img
              :src="urlImagen(auto.imagen)"
              class="card-img-top imagen-vehiculo"
              alt="Imagen del vehículo"
              @click="verDetalles(auto)"
            />

            <div class="card-body">
              <h5 class="card-title text-primary fw-bold">
                {{ auto.marca }} {{ auto.modelo }}
              </h5>

              <p class="dato"><strong>Año:</strong> {{ auto.anio }}</p>
              <p class="dato">
                <strong>Kilómetros:</strong>
                {{ Number(auto.kilometros || 0).toLocaleString() }} km
              </p>
              <p class="dato">
                <strong>Precio:</strong>
                {{ Number(auto.precio || 0).toLocaleString() }} €
              </p>
            </div>

            <div class="card-footer text-center bg-light">
              <button 
              v-if="auto.estado === 'vendido'"
              class="btn btn-sm btn-estado vendido"
              disabled
            >
              <i class="bi bi-x-circle"></i>
              VENDIDO
            </button>
            <button 
              v-else-if="auto.estado === 'reservado'"
              class="btn btn-sm btn-estado reservado"
              disabled
            >
              <i class="bi bi-calendar-check"></i>
              RESERVADO
            </button>
            <button 
              v-else-if="estaEnCesta(auto._id)"
              class="btn btn-sm btn-estado en-cesta"
              disabled
            >
              <i class="bi bi-cart-check"></i>
              EN CESTA
            </button>
            <button 
              v-else
              @click="agregarACesta(auto)"
              class="btn btn-sm btn-estado"
            >
              <i class="bi bi-cart-plus"></i>
              AÑADIR A CESTA
            </button>

            </div>
          </div>
        </div>
      </div>
      <div v-if="vehiculosFiltrados.length === 0" class="alert alert-info text-center mt-4">
        <i class="bi bi-info-circle me-2"></i>No hay vehículos con los filtros seleccionados.
      </div>
    </section>
    <section
    v-if="mostrarModal"
    class="modal fade show"
    style="display: block; background: rgba(0,0,0,0.6)"
    >
    <div class="modal-dialog modal-lg">
        <div class="modal-content">

        <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
            <i class="bi bi-car-front me-2"></i>
            {{ cocheSeleccionado.marca }} {{ cocheSeleccionado.modelo }}
            </h5>
            <button class="btn-close" @click="mostrarModal = false"></button>
        </div>

        <div class="modal-body">
            <div class="text-center mb-3">
            <img
                :src="urlImagen(cocheSeleccionado.imagen)"
                class="img-fluid rounded shadow"
                style="max-height: 250px"
            />
            </div>

            <table class="table table-bordered">
            <tbody>
                <tr><th>Marca</th><td>{{ cocheSeleccionado.marca }}</td></tr>
                <tr><th>Modelo</th><td>{{ cocheSeleccionado.modelo }}</td></tr>
                <tr><th>Año</th><td>{{ cocheSeleccionado.anio }}</td></tr>
                <tr><th>Precio</th><td>{{ cocheSeleccionado.precio }} €</td></tr>
                <tr><th>Kilómetros</th><td>{{ cocheSeleccionado.kilometros }}</td></tr>
                <tr><th>Combustible</th><td>{{ cocheSeleccionado.combustible }}</td></tr>
                <tr><th>Transmisión</th><td>{{ cocheSeleccionado.transmision }}</td></tr>
                <tr><th>Potencia</th><td>{{ cocheSeleccionado.potencia_cv }} CV</td></tr>
                <tr><th>Estado</th><td>{{ cocheSeleccionado.estado }}</td></tr>
                <tr><th>Descripción</th><td>{{ cocheSeleccionado.descripcion }}</td></tr>
            </tbody>
            </table>
        </div>

        <div class="modal-footer">
            <button class="btn btn-secondary" @click="mostrarModal = false">
            Cerrar
            </button>

            <button 
              v-if="cocheSeleccionado.estado === 'disponible'"
              class="btn btn-primary" 
              @click="abrirModalReserva"
            >
              <i class="bi bi-calendar-check me-2"></i> Reservar
            </button>

            <button class="btn btn-success" @click="imprimirPDF">
            <i class="bi bi-printer me-2"></i> Descargar PDF
            </button>
        </div>

        </div>
    </div>
    </section>

    <!-- Modal de Formulario Admin para Reserva -->
    <section
      v-if="mostrarModalReservaAdmin"
      class="modal fade show"
      style="display: block; background: rgba(0,0,0,0.6)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-calendar-check me-2"></i>
              Reservar Vehículo para Cliente
            </h5>
            <button class="btn-close btn-close-white" @click="cerrarModalReservaAdmin"></button>
          </div>

          <div class="modal-body">
            <div class="alert alert-info">
              <strong>{{ cocheSeleccionado.marca }} {{ cocheSeleccionado.modelo }}</strong>
              ({{ cocheSeleccionado.anio }}) - {{ cocheSeleccionado.precio }}€
            </div>

            <form @submit.prevent="confirmarReservaAdmin">
              <div class="mb-3">
                <label for="nombreCliente" class="form-label fw-medium">Nombre del Cliente *</label>
                <input
                  type="text"
                  id="nombreCliente"
                  v-model="datosReservaAdmin.nombre"
                  class="form-control"
                  required
                  placeholder="Nombre completo del cliente"
                />
              </div>

              <div class="mb-3">
                <label for="emailCliente" class="form-label fw-medium">Email del Cliente *</label>
                <input
                  type="email"
                  id="emailCliente"
                  v-model="datosReservaAdmin.email"
                  class="form-control"
                  required
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div class="mb-3">
                <label for="idCliente" class="form-label fw-medium">ID del Cliente</label>
                <input
                  type="text"
                  id="idCliente"
                  v-model="datosReservaAdmin.usuarioId"
                  class="form-control"
                  placeholder="Opcional - ID del cliente en el sistema"
                />
              </div>

              <div class="text-center">
                <button type="submit" class="btn btn-primary px-4">
                  <i class="bi bi-check-circle me-2"></i>Confirmar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getArticulos } from "@/api/articulos.js";
import { addReserva } from "@/api/reservas.js";
import { useCestaStore } from "@/store/cesta.js";
import cachau from "@/assets/cachau.png";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const cestaStore = useCestaStore(); 
const vehiculos = ref([]);
const mostrarModal = ref(false);
const mostrarModalReservaAdmin = ref(false);
const cocheSeleccionado = ref(null);
const filtroMarca = ref("");
const filtroCombustible = ref("");
const filtroEstado = ref("");
const isAdmin = ref(sessionStorage.getItem("isAdmin") === "true");

const datosReservaAdmin = ref({
  nombre: "",
  email: "",
  usuarioId: "",
});

onMounted(async () => {
  vehiculos.value = await getArticulos();

  const vendidos = JSON.parse(localStorage.getItem("cochesVendidos")) || [];

  vehiculos.value.forEach((coche) => {
    if (vendidos.includes(coche._id)) {
      coche.estado = "vendido";
    }
  });
});

const marcasUnicas = computed(() => {
  const marcas = vehiculos.value.map((coche) => coche.marca).filter(Boolean);
  return [...new Set(marcas)].sort();
});

const vehiculosFiltrados = computed(() => {
  return vehiculos.value.filter((coche) => {
    if (filtroMarca.value && coche.marca !== filtroMarca.value) return false;

    if (filtroCombustible.value) {
      const combustible = String(coche.combustible || "").toLowerCase();
      if (combustible !== filtroCombustible.value) return false;
    }

    if (filtroEstado.value && coche.estado !== filtroEstado.value) return false;

    return true;
  });
});

const limpiarFiltros = () => {
  filtroMarca.value = "";
  filtroCombustible.value = "";
  filtroEstado.value = "";
};

const estaEnCesta = (id) => {
  return cestaStore.items.some(item => item.id === id);
};


const urlImagen = (ruta) => {
  if (!ruta) return cachau;;
  return `http://localhost:5000${ruta}`;
};

const agregarACesta = (auto) => {
    if (auto.estado === "vendido" || auto.estado === "reservado") {
        return;
    }

    // Añadir a la cesta sin cambiar el estado del vehículo
    cestaStore.addProducto({
        id: auto._id,
        nombre: `${auto.marca} ${auto.modelo}`,
        precio: auto.precio,
        imagen: urlImagen(auto.imagen),
    });

    Swal.fire({
      icon: "success",
      title: "Añadido a la cesta",
      text: `${auto.marca} ${auto.modelo} se ha añadido a tu cesta.`,
      timer: 1500,
      showConfirmButton: false,
    });
}

const verDetalles = (auto) => {
    cocheSeleccionado.value = auto;
    mostrarModal.value = true;
}

const imprimirPDF = async () => {
    const auto = cocheSeleccionado.value;
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const azul = [33, 150, 243];

    let y = 25;

    // ===== TÍTULO =====
    doc.setFontSize(22);
    doc.setTextColor(...azul);
    doc.text("Ficha del vehículo", pageWidth / 2, y, { align: "center" });

    y += 10;

    doc.setDrawColor(...azul);
    doc.setLineWidth(0.6);
    doc.line(20, y, pageWidth - 20, y);

    y += 15;

    // ===== CARGAR IMAGEN =====
    const urlFinal = auto.imagen
        ? `http://localhost:5000${auto.imagen}`
        : cachau;

    const response = await fetch(urlFinal);
    const blob = await response.blob();

    const base64 = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });

    // ===== IMAGEN CENTRADA GRANDE =====
    const imgWidth = 130;
    const imgHeight = 85;
    const imgX = (pageWidth - imgWidth) / 2;
    doc.addImage(base64, "JPEG", imgX, y, imgWidth, imgHeight);

    y += imgHeight + 15;

    // ===== TABLA DE INFORMACIÓN =====
    autoTable(doc, {
        startY: y,
        theme: "plain", // sin bordes
        styles: {
            fontSize: 11,
            cellPadding: 4,
            textColor: 40
        },
        columnStyles: {
            0: { fontStyle: "bold", textColor: azul, cellWidth: 55 },
            1: { cellWidth: "auto" }
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250] // gris muy suave
        },
        body: [
            ["Marca", auto.marca],
            ["Modelo", auto.modelo],
            ["Año", auto.anio],
            ["Kilómetros", `${auto.kilometros} km`],
            ["Combustible", auto.combustible],
            ["Transmisión", auto.transmision],
            ["Potencia", `${auto.potencia_cv} CV`],
            ["Estado", auto.estado]
        ]
    });

    y = doc.lastAutoTable.finalY + 15;

    // ===== PRECIO DESTACADO =====
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...azul);
    doc.text(`${auto.precio} €`, pageWidth - 25, y, { align: "right" });

    y += 18;

    // ===== DESCRIPCIÓN =====
    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...azul);
    doc.text("Descripción", 25, y);

    y += 10;

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.setTextColor(40);
    doc.text(auto.descripcion || "Sin descripción", 25, y, {
        maxWidth: pageWidth - 50
    });

    // ===== FOOTER =====
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
        `Generado el ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        285,
        { align: "center" }
    );

    doc.save(`vehiculo_${auto.marca}_${auto.modelo}.pdf`);
};

// Obtener datos del usuario desde el token
const obtenerDatosUsuario = () => {
  const token = sessionStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.id,
      nombre: decoded.nombre || "Usuario",
      email: decoded.email || "",
    };
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return null;
  }
};

const abrirModalReserva = async () => {
  const usuario = obtenerDatosUsuario();
  if (!usuario) {
    Swal.fire({
      icon: "error",
      title: "Sesión requerida",
      text: "Debes iniciar sesión para reservar un vehículo.",
      timer: 2000,
    });
    return;
  }

  // Si es admin, mostrar formulario para reservar a nombre de otro
  if (isAdmin.value) {
    mostrarModalReservaAdmin.value = true;
    return;
  }

  // Si es usuario normal, confirmación directa con sus datos
  const result = await Swal.fire({
    title: "¿Confirmar reserva?",
    html: `<p>¿Deseas reservar el vehículo <strong>${cocheSeleccionado.value.marca} ${cocheSeleccionado.value.modelo}</strong>?</p>
           <p class="text-muted">Precio: ${cocheSeleccionado.value.precio}€</p>`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, reservar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#0d6efd",
  });

  if (!result.isConfirmed) return;

  try {
    const fechaActual = new Date().toISOString().split('T')[0];
    
    const nuevaReserva = {
      vehiculoId: cocheSeleccionado.value._id,
      nombreVehiculo: `${cocheSeleccionado.value.marca} ${cocheSeleccionado.value.modelo} (${cocheSeleccionado.value.anio})`,
      usuarioId: usuario.id,
      usuarioNombre: usuario.nombre,
      usuarioEmail: usuario.email,
      fechaInicio: fechaActual,
      fechaFin: fechaActual,
    };

    await addReserva(nuevaReserva);

    Swal.fire({
      icon: "success",
      title: "¡Reserva creada!",
      text: "El vehículo ha sido reservado exitosamente.",
      timer: 2000,
      showConfirmButton: false,
    });

    // Actualizar el estado del vehículo en la lista
    const vehiculo = vehiculos.value.find(v => v._id === cocheSeleccionado.value._id);
    if (vehiculo) {
      vehiculo.estado = "reservado";
    }

    mostrarModal.value = false;
  } catch (error) {
    console.error("Error al crear reserva:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.error || "No se pudo crear la reserva.",
      timer: 2500,
    });
  }
};

const cerrarModalReservaAdmin = () => {
  mostrarModalReservaAdmin.value = false;
  datosReservaAdmin.value = {
    nombre: "",
    email: "",
    usuarioId: "",
  };
};

const confirmarReservaAdmin = async () => {
  try {
    const fechaActual = new Date().toISOString().split('T')[0];
    
    const nuevaReserva = {
      vehiculoId: cocheSeleccionado.value._id,
      nombreVehiculo: `${cocheSeleccionado.value.marca} ${cocheSeleccionado.value.modelo} (${cocheSeleccionado.value.anio})`,
      usuarioId: datosReservaAdmin.value.usuarioId || `cliente-${Date.now()}`,
      usuarioNombre: datosReservaAdmin.value.nombre,
      usuarioEmail: datosReservaAdmin.value.email,
      fechaInicio: fechaActual,
      fechaFin: fechaActual,
    };

    await addReserva(nuevaReserva);

    Swal.fire({
      icon: "success",
      title: "¡Reserva creada!",
      text: `El vehículo ha sido reservado para ${datosReservaAdmin.value.nombre}.`,
      timer: 2000,
      showConfirmButton: false,
    });

    // Actualizar el estado del vehículo en la lista
    const vehiculo = vehiculos.value.find(v => v._id === cocheSeleccionado.value._id);
    if (vehiculo) {
      vehiculo.estado = "reservado";
    }

    cerrarModalReservaAdmin();
    mostrarModal.value = false;
  } catch (error) {
    console.error("Error al crear reserva:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.error || "No se pudo crear la reserva.",
      timer: 2500,
    });
  }
};
</script>

<style scoped>
/* Título */
.titulo-seccion {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 0.7rem;
  border-bottom: 2px solid var(--bs-primary);
  font-weight: 600;
  color: var(--bs-primary);
}

/* Card */
.card-vehiculo {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-vehiculo:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

/* Imagen */
.imagen-vehiculo {
  height: 180px;
  object-fit: cover;
}

/* Texto */
.dato {
  margin-bottom: 0.4rem;
  color: #333;
}

/* Botón */
.btn-estado {
  width: 100%;
  font-weight: 600;
  background-color: var(--bs-primary);
  color: white;
  border: none;
}

.btn-estado.vendido {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-estado.reservado {
  background-color: #ffc107;
  cursor: not-allowed;
  color: #000;
}

.btn-estado.en-cesta {
  background-color: #28a745;
  cursor: not-allowed;
}

.btn-estado:disabled {
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  .card-vehiculo {
    margin: 0 0.5rem;
  }
}
</style>
