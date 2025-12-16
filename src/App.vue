<script setup>
import NavBar from './components/NavBar.vue'
import FooTer from './components/FooTer.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- Vídeo de fondo full screen -->
  <router-view name="background" />

  <!-- Contenedor centrado 80% -->
  <div id="app-container">
    <NavBar />

    <main>
      <router-view />
    </main>

    <FooTer />
  </div>
</template>

<style scoped>
/* Contenedor principal 80% centrado */
#app-container {
  max-width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative; /* Para estar sobre el vídeo */
  z-index: 2;
}
main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
