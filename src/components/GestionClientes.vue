<template>
  <div class="mx-auto mt-2 p-4 pb-5 border rounded-3 shadow-sm bg-light" style="min-height: 75vh;">
    <h3 class="text-center my-2">Gestión de Clientes</h3>

    <!-- Formulario -->
    <form @submit.prevent="guardarCliente" class="mb-4">
      <!-- DNI con validación visual -->
      <div class="mb-3 row align-items-center">
        <!-- Columna DNI -->
        <div class="col-md-4 d-flex align-items-center">
          <label for="dni" class="form-label mb-0 w-25">DNI:</label>
          <div class="flex-grow-1 d-flex align-items-center">
            <input
              type="text"
              id="dni"
              v-model="nuevoCliente.dni"
              @blur="validarDni"
              class="form-control me-2"
              :class="{ 'is-invalid': !dniValido }"
              required
            />
            <button
              type="button"
              class="btn btn-primary"
              @click="buscarClientePorDNI(nuevoCliente.dni)">
              
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>

        <!-- Columna Fecha de Alta -->
        <div class="col-md-4 ms-auto d-flex align-items-center justify-content-end">
          <label for="fechaAlta" class="form-label me-2 mb-0 text-nowrap">Fecha de Alta:</label>
          <input
            type="date"
            id="fechaAlta"
            v-model="nuevoCliente.fechaAlta"
            class="form-control w-auto"
          />
        </div>
      </div>

      <!-- Nombre y Apellidos -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Nombre -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="nombre" class="form-label mb-0 text-nowrap w-25">Nombre:</label>
          <input
            type="text"
            id="nombre"
            v-model="nuevoCliente.nombre"
            class="form-control flex-grow-1"
            @blur="capitalizarTexto('nombre')"
            required
          />
        </div>

        <!-- Apellidos -->
        <div class="col-md-6 d-flex align-items-center ms-auto">
          <label for="apellidos" class="form-label me-4 mb-0 text-nowrap">Apellidos:</label>
          <input
            type="text"
            id="apellidos"
            v-model="nuevoCliente.apellidos"
            class="form-control flex-grow-1"
            @blur="capitalizarTexto('apellidos')"
            required
          />
        </div>
      </div>

      <!-- Email y Móvil -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Email -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="email" class="form-label mb-0 text-nowrap w-25">Email:</label>
          <div class="d-flex flex-column w-100">
            <input
              type="email"
              id="email"
              v-model="nuevoCliente.email"
              class="form-control flex-grow-1"
              @blur="validarEmail"
              :class="{ 'is-invalid': !emailValido }"
              required
            />
            <div v-if="!emailValido" class="invalid-feedback">
              El email debe tener un formato válido (ej: usuario@dominio.com).
            </div>
          </div>
        </div>

        <!-- Móvil -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="movil" class="form-label me-5 ms-5 mb-0 text-nowrap">Móvil:</label>
          <div class="d-flex flex-column w-100">
            <input
              type="tel"
              id="movil"
              v-model="nuevoCliente.movil"
              @blur="validarMovil"
              class="form-control flex-grow-1"
              :class="{ 'is-invalid': !movilValido }"
            />
            <div v-if="!movilValido" class="invalid-feedback">
              El móvil debe tener 9 dígitos y empezar por 6 o 7.
            </div>
          </div>
        </div>
      </div>

      <!-- Dirección, Provincia y Municipio -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Dirección -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="direccion" class="form-label mb-0 w-25 text-nowrap">Dirección:</label>
          <input
            type="text"
            id="direccion"
            v-model="nuevoCliente.direccion"
            @blur="capitalizarTexto('direccion')"
            class="form-control flex-grow-1"
          />
        </div>

        <!-- Provincia -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="provincia" class="form-label me-2 ms-5 mb-0 text-nowrap">Provincia:</label>
          <select
            id="provincia"
            v-model="nuevoCliente.provincia"
            class="form-select flex-grow-1 w-25"
            @change="filtrarMunicipios"
          >
            <option disabled value="">Seleccione provincia</option>
            <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">
              {{ prov.nm }}
            </option>
          </select>
        </div>

        <!-- Municipio -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="municipio" class="form-label me-2 ms-4 mb-0 text-nowrap">Municipio:</label>
          <select
            id="municipio"
            v-model="nuevoCliente.municipio"
            class="form-select flex-grow-1 w-auto"
          >
            <option disabled value="">Seleccione municipio</option>
            <option v-for="mun in municipiosFiltrados" :key="mun.id" :value="mun.nm">
              {{ mun.nm }}
            </option>
          </select>
        </div>
      </div>

      <!-- Histórico -->
      <div class="d-flex justify-content-end">
        <div class="form-check form-switch ms-3">
          <input
            type="checkbox"
            id="historico"
            v-model="mostrarHistorico"
            class="form-check-input"
            @change="cargarClientes"
          />
          <label for="historico" class="form-check-label ms-2">Histórico</label>
        </div>
      </div>

      <!-- Botón centrado -->
      <div class="text-center">
        <button type="submit" class="btn btn-primary border-0 shadow-none rounded-0">
          {{ editando ? 'Modificar Cliente' : 'Guardar Cliente' }}
        </button>
      </div>
    </form>

    <!-- Lista de Clientes -->
    <div class="table-responsive">
      <h4 class="text-center w-100">Listado Clientes</h4>
      <table class="table table-bordered table-striped table-hover table-sm align-middle">
        <thead class="table-primary">
          <tr>
            <th class="text-center">ID</th>
            <th class="text-center">Apellidos</th>
            <th class="text-center">Nombre</th>
            <th class="text-center">Móvil</th>
            <th class="text-center">Municipio</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cliente, index) in clientes" :key="index">
            <th scope="row" class="text-center">{{ index + 1 }}</th>
            <td>{{ cliente.apellidos }}</td>
            <td>{{ cliente.nombre }}</td>
            <td class="text-center">{{ cliente.movil }}</td>
            <td class="text-center">{{ cliente.municipio }}</td>
            <td class="align-middle text-center">
              <button
                @click="eliminarCliente(cliente.movil)"
                class="btn btn-danger btn-sm"
                title="Eliminar Cliente"
              >
                <i class="bi bi-trash"></i>
              </button>
              <button
                @click="editarCliente(index)"
                class="btn btn-warning btn-sm ms-2"
                title="Editar Cliente"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                v-if="cliente.historico === false"
                @click="activarCliente(cliente)"
                class="btn btn-secondary btn-sm ms-2 border-0 shadow-none rounded-0"
                title="Activar cliente"
              >
                <i class="bi bi-person-check"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import provmuniData from '@/data/provmuni.json';
import { ref, onMounted } from 'vue';
import { getClientes, deleteCliente, addCliente, updateCliente, getClientePorDni } from '@/api/clientes.js';
import Swal from 'sweetalert2';

const nuevoCliente = ref({
  dni: '',
  nombre: '',
  apellidos: '',
  email: '',
  movil: '',
  direccion: '',
  provincia: '',
  municipio: '',
  fechaAlta: '',
  historico: false
});

const clientes = ref([]);
const mostrarHistorico = ref(false);
const editando = ref(false);
const clienteEditandoId = ref(null);
const dniValido = ref(true);
const movilValido = ref(true);
const emailValido = ref(true);

const numClientes = ref(0);
const currentPage = ref(1);
const clientesPorPage = 10;

const movilRegex = /^[67][0-9]{8}$/;
const provincias = ref(provmuniData.provincias);
const municipios = ref(provmuniData.municipios);
const municipiosFiltrados = ref([]);

onMounted(() => {
  cargarClientes();
});

const cargarClientes = async () => {
  try {
    const data = await getClientes(mostrarHistorico.value);
    clientes.value = data || [];
    numClientes.value = clientes.value.length;
    currentPage.value = 1;

    Swal.fire({
      icon: 'success',
      title: 'Listando Clientes...',
      showConfirmButton: false,
      timer: 1500
    });
  } catch (error) {
    console.error('Error cargando clientes:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error cargando clientes',
      text: 'No se pudieron obtener los datos del servidor.',
      timer: 2000,
      showConfirmButton: false
    });
  }
};

const editarCliente = (index) => {
  const cliente = clientes.value[index];
  if (!cliente) return;

  nuevoCliente.value = { ...cliente };
  editando.value = true;
  clienteEditandoId.value = cliente.id;
  nuevoCliente.value.fechaAlta = formatearFechaParaInput(cliente.fechaAlta);
  filtrarMunicipios();
};

const guardarCliente = async () => {
  if (!editando.value) {
    const duplicado = clientes.value.find(c =>
      c.dni === nuevoCliente.value.dni ||
      c.movil === nuevoCliente.value.movil ||
      c.email === nuevoCliente.value.email
    );
    if (duplicado) {
      Swal.fire({
        icon: 'error',
        title: 'DNI, móvil o email duplicados',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
  }

  const result = await Swal.fire({
    title: editando.value ? '¿Desea modificar este cliente?' : '¿Desea grabar este cliente?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: editando.value ? 'Modificar' : 'Grabar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  try {
    if (editando.value) {
      const clienteActualizado = await updateCliente(clienteEditandoId.value, nuevoCliente.value);
      const index = clientes.value.findIndex(c => c.id === clienteEditandoId.value);
      if (index !== -1) clientes.value[index] = clienteActualizado;

      Swal.fire({
        icon: 'success',
        title: 'Cliente modificado',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      const clienteAgregado = await addCliente(nuevoCliente.value);
      clientes.value.push(clienteAgregado);

      Swal.fire({
        icon: 'success',
        title: 'Cliente agregado',
        showConfirmButton: false,
        timer: 1500
      });
    }

    // Reset formulario
    nuevoCliente.value = {
      dni: '',
      nombre: '',
      apellidos: '',
      email: '',
      movil: '',
      direccion: '',
      provincia: '',
      municipio: '',
      fechaAlta: '',
      historico: true
    };

    editando.value = false;
    clienteEditandoId.value = null;

    dniValido.value = true;
    movilValido.value = true;
    emailValido.value = true;

    clientes.value = await getClientes();
  } catch (error) {
    console.error('Error al guardar cliente:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar cliente',
      text: 'Inténtelo de nuevo o contacte con el administrador.',
      showConfirmButton: false,
      timer: 1500
    });
  }
};

const eliminarCliente = async (movil) => {
  clientes.value = await getClientes();
  const clienteAEliminar = clientes.value.find(c => c.movil === movil);
  if (!clienteAEliminar) return;

  const result = await Swal.fire({
    title: `¿Eliminar al cliente ${clienteAEliminar.nombre} ${clienteAEliminar.apellidos}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  await deleteCliente(clienteAEliminar.id);
  clientes.value = await getClientes();
  Swal.fire({ icon: 'success', title: 'Cliente eliminado', timer: 1500 });
};

const buscarClientePorDNI = async (dni) => {
  if (!dni || dni.trim() === '') {
    Swal.fire({
      icon: 'warning',
      title: 'Debe introducir un DNI antes de buscar.',
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }

  try {
    const cliente = await getClientePorDni(dni.trim().toUpperCase());

    if (!cliente) {
      Swal.fire({
        icon: 'info',
        title: 'Cliente no encontrado',
        text: 'No existe ningún cliente con ese DNI.',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    // ✅ Cargar los datos en el formulario
    nuevoCliente.value = { ...cliente };
    nuevoCliente.value.fecha_alta = formatearFechaParaInput(cliente.fecha_alta);

    // Actualiza lista de municipios si cambia la provincia
    filtrarMunicipios();
    nuevoCliente.value.municipio = cliente.municipio;
    //opcional
    editando.value = true;
    clienteEditandoId.value = cliente.id;

    Swal.fire({
      icon: 'success',
      title: 'Cliente encontrado y cargado',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Error buscando cliente por DNI:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al buscar cliente',
      text: 'Verifique la conexión o contacte con el administrador.',
      timer: 2000,
      showConfirmButton: false
    });
  }
};

const activarCliente = async (cliente) => {
  const confirmacion = await Swal.fire({
    title: `¿Activar cliente ${cliente.nombre} ${cliente.apellidos}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Activar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirmacion.isConfirmed) return;

  const clienteActivado = { ...cliente, historico: true };
  await updateCliente(cliente.id, clienteActivado);
  await cargarClientes();

  Swal.fire({
    icon: 'success',
    title: 'Cliente reactivado',
    showConfirmButton: false,
    timer: 1500
  });
};

function formatearFechaParaInput(fecha) {
  if (!fecha) return '';

  if (fecha.includes('/')) {
    const [dd, mm, yyyy] = fecha.split('/');
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }

  if (fecha.includes('-')) {
    const partes = fecha.split('-');
    if (partes.length === 3) return fecha;
  }

  return '';
}

const validarDniNie = (valor) => {
  const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const dniRegex = /^[0-9]{8}[A-Z]$/;
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;
  valor = valor.toUpperCase();

  if (dniRegex.test(valor)) {
    const num = parseInt(valor.slice(0, 8), 10);
    return valor[8] === letras[num % 23];
  } else if (nieRegex.test(valor)) {
    const nie = valor.replace('X', '0').replace('Y', '1').replace('Z', '2');
    const num = parseInt(nie.slice(0, 8), 10);
    return valor[8] === letras[num % 23];
  }
  return false;
};

const validarDni = () => {
  nuevoCliente.value.dni = nuevoCliente.value.dni.trim().toUpperCase();
  dniValido.value = validarDniNie(nuevoCliente.value.dni);
};

const validarEmail = () => {
  const email = nuevoCliente.value.email.trim();
  emailValido.value = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validarMovil = () => {
  const movil = nuevoCliente.value.movil.trim();
  if (!movil) return (movilValido.value = true);
  movilValido.value = movilRegex.test(movil);
};

const capitalizarTexto = (campo) => {
  const texto = nuevoCliente.value[campo] ?? '';
  nuevoCliente.value[campo] = texto
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
};

const filtrarMunicipios = () => {
  const nombreProv = nuevoCliente.value.provincia;
  const prov = provincias.value.find(p => p.nm === nombreProv);
  if (!prov) return (municipiosFiltrados.value = []);
  const codigoProv = prov.id.slice(0, 2);
  municipiosFiltrados.value = municipios.value.filter(m => m.id.startsWith(codigoProv));
  nuevoCliente.value.municipio = '';
};
</script>

<style scoped>

.is-invalid {
  border-color: #f28b82 !important;
  background-color: #ffe6e6;
}
.invalid-feedback {
  display:block;
}

#app > main > div > form > div:nth-child(2) > div.col-md-6.d-flex.align-items-center.ms-auto {
  margin-left: 48px !important
}

</style>
