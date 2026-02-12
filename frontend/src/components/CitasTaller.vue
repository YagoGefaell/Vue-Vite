<template>
  <div class="container-fluid my-4 p-4 border rounded-4 shadow-lg bg-white">
    <!-- Título principal -->
    <h4 class="text-center mb-4 fw-semibold text-primary border-bottom pb-2">
      <i class="bi bi-wrench me-2"></i>Taller
    </h4>

    <!-- Formulario -->
    <form
      @submit.prevent="guardarModelo"
      class="p-3 bg-light rounded-3 border shadow-sm"
    >
      <div class="row g-3 mb-3">
        <div class="col-md-4">
          <label class="form-label fw-medium">Matrícula</label>
          <input
            type="text"
            class="form-control form-control-sm shadow-none"
            v-model="nuevoModelo.matricula"
            @blur="validarMatricula"
            :class="{ 'is-invalid': !matriculaValida }"
            placeholder="Ej: 1234ABC"
            required
          />
        </div>

        <div class="col-md-4">
          <label class="form-label fw-medium">Móvil</label>
          <input
            type="tel"
            class="form-control form-control-sm shadow-none"
            v-model="nuevoModelo.movilCliente"
            @blur="validarMovil"
            :class="{ 'is-invalid': !movilValido }"
            placeholder="Ej: 612345678"
            required
          />
        </div>

        <div class="col-md-4">
          <label class="form-label fw-medium">Servicio</label>
          <select
            class="form-select form-select-sm shadow-none"
            v-model="nuevoModelo.servicioTaller"
            required
          >
            <option disabled value="">Seleccione un servicio</option>
            <option v-for="opcion in opcionesServicio" :key="opcion" :value="opcion">
              {{ opcion }}
            </option>
          </select>
        </div>
      </div>

      <div class="row g-3 mt-2 align-items-center">
        <div class="col-md-6">
          <label class="form-label fw-medium">Fecha Cita</label>
          <input
            type="date"
            class="form-control form-control-sm shadow-none"
            v-model="nuevoModelo.fechaAlta"
            required
          />
        </div>

        <div class="col-md-6 d-flex align-items-center">
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              v-model="nuevoModelo.acepta"
              id="acepta"
            />
            <label class="form-check-label" for="acepta">Acepta el presupuesto</label>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-center mt-4">
        <button
          type="submit"
          class="btn btn-primary px-4 shadow-sm"
          :disabled="!nuevoModelo.acepta"
        >
          {{ editando ? "Modificar" : "Agendar" }}
        </button>
        <button type="button" class="btn btn-secondary ms-2" @click="limpiarPagina">
          Limpiar
        </button>
      </div>
    </form>

    <!-- Tabla de citas -->
    <div class="table-responsive mt-4" v-if="citas.length > 0">
      <table class="table table-hover table-bordered align-middle text-center table-striped">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Matrícula</th>
            <th>Móvil</th>
            <th>Servicio</th>
            <th>Fecha Cita</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cita, index) in citasPaginadas" :key="cita.id || index">
            <td>{{ (currentPage - 1) * citasPorPage + index + 1 }}</td>
            <td>{{ cita.matricula }}</td>
            <td>{{ cita.movilCliente }}</td>
            <td>{{ cita.servicioTaller }}</td>
            <td>{{ cita.fechaAlta }}</td>
            <td>{{ cita.estadoCita }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="editarModelo(cita.id)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger" @click="borrarModelo(cita.id)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación -->
      <div class="d-flex justify-content-center align-items-center my-3">
        <button class="btn btn-outline-primary btn-sm me-2" @click="beforePage" :disabled="currentPage <= 1">
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="text-muted mx-2">Página {{ currentPage }} de {{ totalPages }}</span>
        <button class="btn btn-outline-primary btn-sm ms-2" @click="nextPage" :disabled="currentPage >= totalPages">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import { getCita, addCita, updateCita, deleteCita } from "@/api/taller.js";

// 🔹 Variables de estado
const nuevoModelo = ref({
  matricula: "",
  movilCliente: "",
  fechaAlta: "",
  servicioTaller: "",
  estadoCita: "Pendiente",
  acepta: false,
});

const citas = ref([]);
const editando = ref(false);
const modeloEditandoId = ref("");

// 🔹 Validaciones
const matriculaValida = ref(true);
const movilValido = ref(true);

const validarMatricula = () => {
  const regex = /^[0-9]{4}[A-Za-z]{3}$/;
  matriculaValida.value = regex.test(nuevoModelo.value.matricula.trim());
};

const validarMovil = () => {
  const regex = /^[67]\d{8}$/;
  movilValido.value = regex.test(nuevoModelo.value.movilCliente.trim());
};

// 🔹 Opciones de servicio
const opcionesServicio = [
  "Revision",
  "PreITV",
  "Neumáticos",
  "Frenos",
  "Cambio de aceite",
];

// 🔹 PAGINACIÓN
const currentPage = ref(1);
const citasPorPage = 5;

const totalPages = computed(() => Math.ceil(citas.value.length / citasPorPage));

const citasPaginadas = computed(() => {
  const start = (currentPage.value - 1) * citasPorPage;
  const end = start + citasPorPage;
  return citas.value.slice(start, end);
});

const nextPage = () => { if(currentPage.value < totalPages.value) currentPage.value++; };
const beforePage = () => { if(currentPage.value > 1) currentPage.value--; };

// 🔹 Funciones CRUD
const cargarCitas = async () => {
  try {
    const data = await getCita();
    citas.value = Array.isArray(data) ? data : [];
    // Ordenar por fecha descendente
    citas.value.sort((a, b) => new Date(b.fechaAlta) - new Date(a.fechaAlta))
    console.log("Citas cargadas:", citas.value);
  } catch (error) {
    console.error("Error al cargar citas:", error);
  }
};

const guardarModelo = async () => {
  if (!nuevoModelo.value.matricula.trim() || !nuevoModelo.value.movilCliente.trim()) {
    Swal.fire("Debes rellenar todos los campos");
    return;
  }

  const confirm = await Swal.fire({
    title: editando.value ? "¿Desea modificar esta cita?" : "¿Desea agregar esta cita?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: editando.value ? "Modificar" : "Añadir",
    cancelButtonText: "Cancelar",
  });

  if (!confirm.isConfirmed) return;

  try {
    if (editando.value) {
      await updateCita(modeloEditandoId.value, nuevoModelo.value);
      const index = citas.value.findIndex(c => c.id === modeloEditandoId.value);
      if (index !== -1) citas.value[index] = { ...nuevoModelo.value };
      Swal.fire({ icon: "success", title: "Cita modificada", showConfirmButton: false, timer: 1500 });
    } else {
      await addCita(nuevoModelo.value);
      citas.value.unshift({ ...nuevoModelo.value });
      Swal.fire({ icon: "success", title: "Cita agregada", showConfirmButton: false, timer: 1500 });
    }
    limpiarPagina();
  } catch (error) {
    console.error("Error al guardar cita:", error);
    Swal.fire({ icon: "error", title: "Error al guardar cita", text: "Inténtelo de nuevo más tarde", showConfirmButton: false, timer: 1500 });
  }
};

const borrarModelo = async (id) => {
  const confirm = await Swal.fire({
    title: "¿Está seguro de eliminar esta cita?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  });
  if (!confirm.isConfirmed) return;

  try {
    await deleteCita(id);
    citas.value = citas.value.filter(c => c.id !== id);
    Swal.fire({ icon: "success", title: "Cita eliminada", showConfirmButton: false, timer: 1500 });
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    Swal.fire({ icon: "error", title: "Error al eliminar cita", text: "Inténtelo de nuevo más tarde", showConfirmButton: false, timer: 1500 });
  }
};

const editarModelo = async (id) => {
  const cita = citas.value.find(c => c.id === id);
  if (!cita) return;
  nuevoModelo.value = { ...cita };
  modeloEditandoId.value = id;
  editando.value = true;
};

const limpiarPagina = () => {
  nuevoModelo.value = {
    matricula: "",
    movilCliente: "",
    fechaAlta: "",
    servicioTaller: "",
    estadoCita: "Pendiente",
    acepta: false,
  };
  editando.value = false;
  modeloEditandoId.value = "";
};

// 🔹 Montaje
onMounted(() => cargarCitas());
</script>
