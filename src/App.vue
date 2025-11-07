<script setup>
import NavBar from './components/NavBar.vue'
import FooTer from './components/FooTer.vue'
</script>

<template>
  <!-- contenedor padre a 80% y centrado -->
  <div id="app">
    <NavBar />   <!-- Fijo arriba, pero dentro del 80% -->
    <main class="d-flex flex-column flex-grow-1">
      <router-view />
    </main>
    <FooTer class="mt-auto" />  <!-- Fijo abajo, pero dentro del 80% -->
  </div>
</template>

<style scoped>
#app {
  max-width: 80%;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
