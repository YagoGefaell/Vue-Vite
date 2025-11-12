<template>
  <section class="video-hero position-relative text-light text-center d-flex flex-column justify-content-center align-items-center">
    <!-- 🎥 Vídeo de fondo -->
    <video
      ref="videoPlayer"
      autoplay
      muted
      playsinline
      class="video-bg"
    >
      Tu navegador no soporta video HTML5.
    </video>

    <!-- 🖋 Contenido encima -->
    <div class="content position-relative z-2">
      <h1 class="display-3 fw-bold mb-3">Bienvenido a Teis Motor</h1>
      <p class="lead mb-4">Innovación, potencia y diseño en cada detalle</p>
      <div>
        <router-link to="/clientes" class="btn btn-primary btn-lg me-3 shadow">
          Ver Catálogo
        </router-link>
        <router-link to="/contacto" class="btn btn-outline-light btn-lg shadow">
          Contáctanos
        </router-link>
      </div>
    </div>

    <!-- 🔲 Capa oscura para mejor legibilidad -->
    <div class="overlay"></div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// ✅ Importamos correctamente los vídeos (Webpack/Vite los resuelve bien)
import coche1 from '@/assets/videos/coche1.mp4'
import coche2 from '@/assets/videos/coche2.mp4'
import coche3 from '@/assets/videos/coche3.mp4'

const videoPlayer = ref(null)
const videos = [coche1, coche2, coche3]

let currentIndex = 0

onMounted(() => {
  const player = videoPlayer.value
  if (!player) return

  // Cargar primer vídeo
  player.src = videos[currentIndex]
  player.play()

  // Al terminar, pasar al siguiente vídeo
  player.addEventListener('ended', () => {
    currentIndex = (currentIndex + 1) % videos.length
    player.src = videos[currentIndex]
    player.play()
  })
})
</script>

<style scoped>
.video-hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

/* 🎬 Video ocupa todo el fondo */
.video-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* 🕶 Capa oscura semitransparente */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.55);
  z-index: 1;
}

/* 🖋 Texto y botones encima */
.content {
  z-index: 2;
}
</style>
