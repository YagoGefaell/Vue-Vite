<template>
  <div class="container mt-4 p-4 border rounded shadow-sm bg-light">
    <h3 class="text-center my-3 gestion-header">
      <i class="bi bi-people-fill"></i> Registro de Coches
    </h3>

    <!-- Formulario -->
    <form @submit.prevent="guardarCoche" class="mb-4">

      <!-- Matrícula -->
      <div class="mb-3">
        <label for="matricula" class="form-label">Matrícula:</label>
        <input type="text" id="matricula" v-model="nuevoCoche.matricula" class="form-control" required>
      </div>

      <!-- Modelo -->
      <div class="mb-3">
        <label for="modelo" class="form-label">Modelo:</label>
        <input type="text" id="modelo" v-model="nuevoCoche.modelo" class="form-control" required>
      </div>

      <!-- Combustible -->
      <div class="mb-3">
        <label class="form-label">Combustible:</label>
        <div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="gasolina" value="Gasolina" v-model="nuevoCoche.combustible">
            <label class="form-check-label" for="gasolina">Gasolina</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="diesel" value="Diésel" v-model="nuevoCoche.combustible">
            <label class="form-check-label" for="diesel">Diésel</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="electrico" value="Eléctrico" v-model="nuevoCoche.combustible">
            <label class="form-check-label" for="electrico">Eléctrico</label>
          </div>
        </div>
      </div>

      <!-- Fecha de alta -->
      <div class="mb-3">
        <label for="fechaAlta" class="form-label">Fecha de alta:</label>
        <input type="date" id="fechaAlta" v-model="nuevoCoche.fechaAlta" class="form-control" required>
      </div>

      <!-- Dueño -->
      <div class="mb-3">
        <label for="dueno" class="form-label">Dueño:</label>
        <input type="text" id="dueno" v-model="nuevoCoche.dueno" class="form-control" required>
      </div>

      <!-- Marca (select JSON) -->
      <div class="mb-3">
        <label for="marca" class="form-label">Marca:</label>
        <select id="marca" v-model="nuevoCoche.marca" class="form-select" required>
          <option value="" disabled>Selecciona una marca</option>
          <option v-for="marca in marcas.marcas" :key="marca" :value="marca">{{ marca }}</option>
        </select>
      </div>

      <!-- Tiene ITV -->
      <div class="mb-3 form-check">
        <input type="checkbox" id="itv" v-model="nuevoCoche.itv" class="form-check-input">
        <label class="form-check-label" for="itv">Tiene ITV</label>
      </div>

      <!-- Botón Guardar -->
      <div class="text-center mt-3">
        <button type="submit" class="btn btn-success px-4">Guardar Coche</button>
      </div>
    </form>

    <!-- Tabla de coches -->
    <div v-if="coches.length" class="table-responsive">
      <table class="table table-striped table-bordered mt-4">
        <thead class="table-dark">
          <tr>
            <th>Matrícula</th>
            <th>Modelo</th>
            <th>Combustible</th>
            <th>Fecha Alta</th>
            <th>Dueño</th>
            <th>Marca</th>
            <th>ITV</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="coche in coches" :key="coche.id">
            <td>{{ coche.matricula }}</td>
            <td>{{ coche.modelo }}</td>
            <td>{{ coche.combustible }}</td>
            <td>{{ coche.fechaAlta }}</td>
            <td>{{ coche.dueno }}</td>
            <td>{{ coche.marca }}</td>
            <td>{{ coche.itv ? 'Sí' : 'No' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import marcasData from '@/data/marcas.json'

const API_Coches = "http://localhost:3000/coches"

// Estado reactivo del nuevo coche
const nuevoCoche = ref({
  matricula: '',
  modelo: '',
  combustible: 'Gasolina',
  fechaAlta: '',
  dueno: '',
  marca: '',
  itv: false,
  id: ''
})

// Lista de marcas cargadas desde JSON
const marcas = ref(marcasData)

// Lista de coches (simulando db.json)
const coches = ref([])

// Función para cargar coches desde db.json
async function cargarCoches() {
  try {
    const res = await fetch('http://localhost:3000/coches')
    coches.value = await res.json()
  } catch (error) {
    console.error('Error cargando coches:', error)
  }
}

function generarId() {
  return Math.random().toString(16).slice(2, 6)
}

// Guardar coche (simula POST)
async function guardarCoche() {
  // Validación básica
  if (!nuevoCoche.value.matricula || !nuevoCoche.value.modelo) {
    alert('Debes completar todos los campos obligatorios')
    return
  }

  const nuevo = {
    id: generarId(),
    matricula: nuevoCoche.value.matricula.trim(),
    modelo: nuevoCoche.value.modelo.trim(),
    combustible: nuevoCoche.value.combustible,
    fechaAlta: nuevoCoche.value.fechaAlta,
    dueno: nuevoCoche.value.dueno.trim(),
    marca: nuevoCoche.value.marca,
    itv: nuevoCoche.value.itv
  }

  try {
    const res = await fetch(API_Coches, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo)
    })

    if (!res.ok) throw new Error("Error al guardar la noticia")

    const nueva = await res.json()
    coches.value.push(nueva)

    // Resetear formulario
    nuevoCoche.value = {
      matricula: '',
      modelo: '',
      combustible: 'Gasolina',
      fechaAlta: '',
      dueno: '',
      marca: '',
      itv: false,
      id: ''
    }

  } catch (error) {
    console.error("Error al agregar noticia:", error)
  }
}

onMounted(() => {
  cargarCoches()
})
</script>

<style scoped>
.gestion-header {
  font-weight: bold;
  color: #003366;
}
</style>
