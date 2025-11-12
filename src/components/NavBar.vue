<template>
  <nav class="navbar navbar-expand-lg navbar-dark custom-navbar shadow-sm sticky-top">
    <div class="container-fluid px-4">
      <!-- Marca / Logo -->
      <router-link class="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
        <img src="../assets/TeisMotor.svg" alt="logo" style="width: 50px; height: 50px;"/>
      </router-link>

      <!-- Botón Hamburguesa -->
      <button
        class="navbar-toggler border-0 shadow-none"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Enlaces -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav align-items-lg-center gap-lg-3 mt-3 mt-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/coches">Coches</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/modelos">Modelos</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/clientes">Clientes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/noticias">Noticias</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contacto">Contacto</router-link>
          </li>
          <li class="nav-item">
            <router-link class="btn btn-outline-light btn-sm rounded-pill px-3 ms-lg-2" to="/login">
              <i class="bi bi-person me-1"></i> Login
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
// No requiere lógica adicional
</script>

<style scoped>
/* 🎨 Fondo con degradado elegante */
.custom-navbar {
  background: linear-gradient(90deg, #0062E6 0%, #33AEFF 100%);
  backdrop-filter: blur(6px);
}

/* Marca con estilo */
.navbar-brand {
  font-size: 1.3rem;
  letter-spacing: 0.5px;
  transition: transform 0.3s ease;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

/* Links de navegación */
.nav-link {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  position: relative;
  transition: color 0.3s ease;
}

/* Subrayado animado al hover */
.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #fff;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after,
.router-link-exact-active::after {
  width: 60%;
}

.nav-link:hover,
.router-link-exact-active {
  color: #fff !important;
}

/* Botón Login */
.btn-outline-light {
  border-color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background-color: #fff;
  color: #007BFF;
  border-color: #fff;
}

/* Adaptación móvil */
@media (max-width: 992px) {
  .navbar-collapse {
    background: rgba(0, 0, 0, 0.2);
    padding: 1rem;
    border-radius: 1rem;
    backdrop-filter: blur(8px);
  }
}
</style>
