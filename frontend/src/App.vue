<template>
  <div id="app">
    <NavBar />
    <main>
      <router-view />
    </main>
    <FooTer class="mt-auto" />

    <!-- Chat widget flotante -->
    <ChatWidget class="position-fixed bottom-0 end-0 m-3" />
  </div>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
import ChatWidget from "./components/ChatWidget.vue";
import FooTer from "./components/FooTer.vue";
</script>

<style scoped>
#app {
  max-width: 80%;
  margin: 0 auto; /* centra horizontalmente */
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
