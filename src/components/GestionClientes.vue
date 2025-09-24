<template>
  <div class="gestion-clientes align-items-center border p-4 rounded shadow-sm mt-4 mb-4">
    <h2 class="text-center my-4">Gestión de Clientes</h2>

    <!-- Formulario -->
    <form @submit.prevent="agregarCliente" class="mb-5 d-flex flex-column mx-auto" style="max-width: 700px;">
      <!-- DNI -->
      <div class="mb-3 d-flex justify-content-between align-items-center gap-3 w-100">
        <div class="d-flex align-items-center">
          <label for="dni" class="me-2 mb-0">DNI:</label>
          <div style="position: relative; max-width: 180px; width: 100%;">
            <input
              type="text"
              id="dni"
              v-model="nuevoCliente.dni"
              @blur="validarDni"
              class="form-control me-3"
              :class="{'is-invalid':!dniValido}"
              required
            />
            <div v-if="!dniValido" class="invalid-feedback">
              DNI/NIE no válido.
            </div>
          </div>
        </div>
        <!-- Fecha de Alta -->
        <div class="d-flex align-items-center">
          <label for="fechaAlta" class="me-2 mb-0">Fecha de Alta:</label>
          <div style="max-width: 180px; width: 100%;">
            <input
              type="date"
              id="fechaAlta"
              v-model="nuevoCliente.fechaAlta"
              class="form-control"
            />
          </div>
        </div>
      </div>

      <!-- Nombre y Apellidos -->
      <div class="mb-3 d-flex gap-3">
   
          <label for="nombre" class="form-label">Nombre:</label>
          <input
            type="text"
            id="nombre"
            v-model="nuevoCliente.nombre"
            class="form-control"
            required
        />
          <label for="apellidos" class="form-label">Apellidos:</label>
          <input
            type="text"
            id="apellidos"
            v-model="nuevoCliente.apellidos"
            class="form-control"
            required
          />
      </div>

      <!-- Email -->
      <div class="mb-3 d-flex align-items-center">
        <label for="email" class="me-2 mb-0" style="width: 120px;">Email:</label>
        <input
          type="email"
          id="email"
          v-model="nuevoCliente.email"
          class="form-control"
          required
        />
  
        <!-- Móvil -->
        <label for="movil" class="me-2 mb-0" style="width: 120px;">Móvil:</label>
        <input
          type="tel"
          id="movil"
          v-model="nuevoCliente.movil"
          class="form-control"
        />
      </div>

      <!-- Dirección -->
      <div class="mb-3 d-flex align-items-center">
        <label for="direccion" class="me-2 mb-0" style="width: 120px;">Dirección:</label>
        <input
          type="text"
          id="direccion"
          v-model="nuevoCliente.direccion"
          class="form-control"
        />
        <label for="provincia" class="form-label">Provincia:</label>
        <select
          id="provincia"
          v-model="nuevoCliente.provincia"
          class="form-select"
          @change="filtrarMunicipios"
        >
          <option disabled value="">Seleccione provincia</option>
          <option
            v-for="prov in provincias"
            :key="prov"
            :value="prov"
          >
            {{ prov }}
          </option>
        </select>

          <label for="municipio" class="form-label">Municipio:</label>
          <select
            id="municipio"
            v-model="nuevoCliente.municipio"
            class="form-select"
          >
            <option disabled value="">Seleccione municipio</option>
            <option
              v-for="mun in municipiosFiltrados"
              :key="mun"
              :value="mun"
            >
              {{ mun }}
            </option>
          </select>
      </div>
      <!-- Histórico -->
      <div class="mb-3 form-check">
        <input
          type="checkbox"
          id="historico"
          v-model="nuevoCliente.historico"
          class="form-check-input"
        />
        <label for="historico" class="form-check-label">Histórico</label>
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-primary">Grabar</button>
      </div>
    </form>

    <!-- Lista de Clientes -->
    <div class="table-responsive">
      <h3>Lista de Clientes</h3>
      <table class="table table-bordered table-striped w-100">
        <thead class="table-primary">
          <tr >
            <th>ID</th>
            <th>Apellidos</th>
            <th>Nombre</th>
            <th>Móvil</th>
            <th>Municipio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cliente, index) in clientes" :key="index">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ cliente.apellidos }}</td>
            <td>{{ cliente.nombre }}</td>
            <td class="text-center">{{ cliente.movil }}</td>
            <td class="text-center">{{ cliente.municipio }}</td>
            <td class="align-middle text-center">
              <button
                @click="eliminarCliente(index)"
                class="btn btn-danger btn-sm">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

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

  const agregarCliente = () => {
    clientes.value.push({ ...nuevoCliente.value });
    // Reiniciar el formulario
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
      historico: false
    };
  };

  const eliminarCliente = (index) => {
    clientes.value.splice(index, 1);
  };

  const dniValido = ref(true);

  const validarDniNie = (valor) => {
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const dniRegex = /^\d{8}[A-Z]$/i;
    const nieRegex = /^[XYZ]\d{7}[A-Z]$/i;

    valor = valor.toUpperCase();

    if(dniRegex.test(valor)) {
      const numero = parseInt(valor.slice(0, 8), 10);
      const letra = valor.charAt(8);
      return letra === letras[numero % 23];
    } else if(nieRegex.test(valor)) {
      const nie = valor.replace('X', '0').replace('Y', '1').replace('Z', '2');
      const numero = parseInt(nie.slice(0, 8), 10);
      const letra = nie.charAt(8);
      return letra === letras[numero % 23];
    } else {
      return false;
    }
  };

  const validarDni = () => {
    const dni = nuevoCliente.value.dni.toUpperCase();
    dniValido.value = validarDniNie(dni);
  };

</script>

<style scoped>
.is-invalid {
  border-color: #f28b82;
  background-color: #ffe6e6;
}

.invalid-feedback {
  display: block;
}

.gestion-clientes {
  height: 80vh;
  width: 95%;
  max-width: none;
  margin: auto;
  padding: 2rem 0;
}

.form-control {
  width: 100%;
}
</style>
