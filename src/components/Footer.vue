<template>
  <footer class="custom-footer mt-auto py-4">
    <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center">
      <p class="mb-2 mb-md-0 text-light small">
        &copy; {{ new Date().getFullYear() }} MiSitio. Todos los derechos reservados.
      </p>
      <ul class="list-inline mb-0">
        <li class="list-inline-item">
          <router-link to="/aviso-legal" class="footer-link">Aviso legal</router-link>
        </li>
        <li class="list-inline-item">
          <router-link to="/politica-privacidad" class="footer-link">Política de privacidad</router-link>
        </li>
        <li class="list-inline-item">
          <router-link to="/contacto" class="footer-link">Contacto</router-link>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
// No necesita lógica
</script>

<style scoped>
.custom-footer {
  background: linear-gradient(90deg, #0062E6 0%, #33AEFF 100%);
  color: #fff;
  box-shadow: 0 -2px 6px rgba(0,0,0,0.1);
  font-size: 0.9rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: color 0.3s ease, text-decoration 0.3s ease;
}

.footer-link:hover {
  color: #fff;
  text-decoration: underline;
}

@media (max-width: 767px) {
  .custom-footer .container {
    text-align: center;
  }
  .custom-footer ul.list-inline {
    margin-top: 0.5rem;
  }
}
</style>
