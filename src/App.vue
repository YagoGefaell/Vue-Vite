<script setup>
  import GestionClientes from './components/GestionClientes.vue';
  import NavBar from './components/NavBar.vue';
  import Footer from './components/Footer.vue';
</script>

<template>
  <div id="app" class="d-flex flex-column vh-100">
    <NavBar />
    <main class="flex-grow-1 overflow-auto">
      <GestionClientes />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
  
</style>
