<template>
  <div class="home-container">
    <!-- Hero -->
    <section class="hero bg-dark text-light d-flex align-items-center" style="min-height: 70vh; background: url('/assets/hero-bmw.jpg') center/cover no-repeat;">
      <div class="container text-center">
        <h1 class="display-4 fw-bold">Bienvenido a BMW Teis</h1>
        <p class="lead mb-4">Descubre los últimos modelos, innovación y potencia al volante</p>
        <router-link to="/clientes" class="btn btn-primary btn-lg me-2">Ver Catálogo</router-link>
        <router-link to="/contacto" class="btn btn-outline-light btn-lg">Contáctanos</router-link>
      </div>
    </section>

    <!-- Modelos Destacados -->
    <section class="py-5">
      <div class="container">
        <h2 class="text-center fw-bold mb-5">Modelos Destacados</h2>
        <div class="row g-4">
          <div class="col-md-4" v-for="(coche, index) in cochesDestacados" :key="index">
            <div class="card h-100 shadow-sm border-0">
              <img :src="coche.imagen" class="card-img-top" :alt="coche.modelo">
              <div class="card-body">
                <h5 class="card-title fw-bold">{{ coche.modelo }}</h5>
                <p class="card-text text-muted">{{ coche.descripcion }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-semibold fs-5">{{ coche.precio }}</span>
                  <router-link :to="`/coches/${coche.id}`" class="btn btn-primary btn-sm">Ver detalles</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Llamado a la acción -->
    <section class="cta bg-primary text-light py-5 mt-5">
      <div class="container text-center">
        <h3 class="fw-bold mb-3">¿Listo para conducir tu BMW?</h3>
        <p class="mb-4">Solicita una prueba de conducción o contáctanos para más información</p>
        <router-link to="/contacto" class="btn btn-outline-light btn-lg">Solicitar prueba</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Ejemplo de coches destacados
const cochesDestacados = ref([
  {
    id: 1,
    modelo: 'BMW Serie 3',
    descripcion: 'Deportivo, elegante y lleno de tecnología.',
    precio: '50.000 €',
    imagen: '/assets/bmw-serie3.jpg'
  },
  {
    id: 2,
    modelo: 'BMW X5',
    descripcion: 'SUV de lujo, potente y espacioso.',
    precio: '75.000 €',
    imagen: '/assets/bmw-x5.jpg'
  },
  {
    id: 3,
    modelo: 'BMW i8',
    descripcion: 'Híbrido deportivo con diseño futurista.',
    precio: '140.000 €',
    imagen: '/assets/bmw-i8.jpg'
  }
])
</script>

<style scoped>
.hero {
  position: relative;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0,0,0,0.5);
}

.hero .btn {
  min-width: 160px;
}

.card img {
  height: 200px;
  object-fit: cover;
}

.cta {
  background: linear-gradient(90deg, #0062E6 0%, #33AEFF 100%);
}

@media (max-width: 767px) {
  .hero {
    min-height: 50vh;
  }

  .card img {
    height: 180px;
  }
}
</style>
