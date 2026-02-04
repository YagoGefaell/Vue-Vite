<template>
  <section class="catalogo-ventas mt-5">
    <h4 class="titulo-seccion">
      <i class="bi bi-cash-coin me-2"></i>Vehículos en Venta
    </h4>

    <div class="row g-4 justify-content-left mt-3">
      <div
        class="col-lg-3 col-md-6 col-sm-12"
        v-for="auto in vehiculos"
        :key="auto.matricula"
      >
        <div class="card card-vehiculo h-100">
          <img
            :src="auto.imageUrl"
            class="card-img-top imagen-vehiculo"
            alt="Imagen del vehículo"
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
              class="btn btn-sm btn-estado"
              :class="{ vendido: auto.estado === 'vendido' }"
              :disabled="auto.estado === 'vendido'"
            >
              <i class="bi bi-cart"></i>
              {{ auto.estado.toUpperCase() }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getArticulos } from "../api/articulos";

const vehiculos = ref([]);

onMounted(async () => {
  const lista = await getArticulos();

  vehiculos.value = lista;
});

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
