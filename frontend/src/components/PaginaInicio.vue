<template>
  <div class="car-video-container">
    <div class="car-video-background-wrapper">
      <video
        ref="videoPlayer"
        autoplay
        muted
        playsinline
        class="car-video-background"
      >
        Tu navegador no soporta video HTML5.
      </video>
    </div>
    <div class="car-video-content">
      <h1 class="display-3 fw-bold text-light mb-3 text-center">Bienvenido a Teis Motor</h1>
      <p class="lead text-light text-center mb-4">Innovación, potencia y diseño en cada detalle</p>
      <div class="d-flex justify-content-center gap-3">
        <router-link to="/ventas" class="btn btn-primary btn-lg shadow">
          Ver Catálogo
        </router-link>
        <router-link to="/contacto" class="btn btn-outline-light btn-lg shadow">
          Contáctanos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import coche from '@/assets/videos/coche.mp4'

const videoPlayer = ref(null)
const carVideos = [coche, coche, coche]
let currentVideoIndex = 0

onMounted(() => {
  const player = videoPlayer.value
  if (!player) return
  player.src = carVideos[currentVideoIndex]
  player.play()
  player.addEventListener('ended', () => {
    currentVideoIndex = (currentVideoIndex + 1) % carVideos.length
    player.src = carVideos[currentVideoIndex]
    player.play()
  })
})
</script>

<style scoped>
.car-video-background-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
}

.car-video-background {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.car-video-content {
  position: relative;
  z-index: 2;
  max-width: 80%;
  margin: 0 auto;
  text-align: center;
  padding-top: 15vh; /* centrado vertical aproximado */
}
</style>
