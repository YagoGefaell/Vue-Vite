<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
    <div class="container-fluid px-4">

      <!-- Logo -->
      <router-link class="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
        <img src="../assets/TeisMotor.svg" alt="logo" class="logo-img" />
        TeisMotor
      </router-link>

      <!-- Botón hamburguesa -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Contenido colapsable -->
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <!-- Links -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/coches">Coches</router-link>
          </li>
          <li>
            <router-link class="nav-link" to="/ventas">Ventas</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/modelos">Modelos</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/clientes">Clientes</router-link>
          </li>
          <li>
            <router-link class="nav-link" to="/taller">Taller</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/noticias">Noticias</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contacto">Contacto</router-link>
          </li>
        </ul>

        <!-- Dropdown usuario -->
        <div class="dropdown ms-auto">
          <button
            class="btn btn-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-person fs-2"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <!-- Mostra “Acceso/Registro” se NON hai usuario logueado -->
            <li v-if="!isLogueado"><router-link class="dropdown-item" to="/login">Acceso</router-link></li>
            <li v-if="!isLogueado"><router-link class="dropdown-item" to="/clientes">Registro</router-link></li>
            <!-- Mostra “Cerrar Sesión” se está logueado -->
            <li v-if="isLogueado">
              <a class="dropdown-item" href="#" @click.prevent="logout">Cerrar Sesión</a>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLogueado = ref(false)
const userName = ref('')

onMounted(() => {
  isLogueado.value = localStorage.getItem('isLogueado') === 'true'
  userName.value = localStorage.getItem('userName') || ''
})

function logout() {
  localStorage.removeItem('isLogueado')
  localStorage.removeItem('userName')
  localStorage.removeItem('isAdmin')
  localStorage.removeItem('isUsuario')

  isLogueado.value = false
  userName.value = ''

  window.location.assign('/')
}
</script>

<style scoped>
/* Logo más bonito */
.logo-img {
  width: 42px;
  height: 42px;
  border-radius: 6px;
  background: white;
  padding: 3px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
}

/* Hover animado con Bootstrap utilities */
.nav-link {
  transition: color 0.25s, transform 0.15s;
}

.nav-link:hover {
  color: #ffffff !important;
  transform: translateY(-2px);
}

/* Botón usuario */
.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: scale(1.05);
}

/* Ajustes responsive */
@media (max-width: 991px) {
  .dropdown-menu {
    text-align: center;
  }
}
</style>
