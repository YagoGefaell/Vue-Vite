<template>
  <div class="container mx-auto my-4 p-4 border rounded-4 shadow-lg bg-light">
    <h1 class="text-center mb-4">Noticias motor</h1>

    <!-- Formulario para agregar noticia -->
    <div class="card mb-5 shadow-sm">
      <div class="card-body">
        <h5 class="card-title mb-3">Agregar nueva noticia</h5>
        <form @submit.prevent="agregarNoticia">
          <div class="mb-3">
            <label class="form-label">Título (máx. 128 caracteres)</label>
            <input
              v-model="nuevaNoticia.titulo"
              type="text"
              class="form-control"
              placeholder="Máximo 128 caracteres"
              maxlength="128"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Contenido (máx. 256 caracteres)</label>
            <textarea
              v-model="nuevaNoticia.contenido"
              class="form-control"
              rows="3"
              placeholder="Máximo 256 caracteres"
              maxlength="256"
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary">
            Grabar noticia
          </button>
        </form>
      </div>
    </div>

    <!-- Lista de noticias -->
    <div class="row g-4">
      <div
        class="col-md-6 col-lg-4"
        v-for="noticia in noticias"
        :key="noticia.id"
      >
        <div
          class="card shadow-sm h-100"
          :class="{ 'border-primary': noticiaExpandida === noticia.id }"
        >
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex justify-content-between align-items-start">
                <h5 class="card-title">{{ noticia.titulo }}</h5>

                <!-- Botón eliminar -->
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="eliminarNoticia(noticia.id)"
                  title="Eliminar noticia"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>

              <p class="card-text text-muted mt-2">
                {{
                  noticiaExpandida === noticia.id
                    ? contenidoLimitado(noticia.contenido)
                    : resumen(noticia.contenido)
                }}
              </p>
            </div>

            <div class="text-end mt-2">
              <button
                class="btn btn-outline-primary btn-sm"
                @click="toggleExpand(noticia.id)"
              >
                {{
                  noticiaExpandida === noticia.id
                    ? 'Leer menos'
                    : 'Leer más'
                }}
              </button>
            </div>
          </div>

          <!-- Fecha -->
          <div class="card-footer text-muted small text-end">
            {{ noticia.fecha }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const API_URL = "http://localhost:3000/noticias"

// Estado principal
const noticias = ref([])
const noticiaExpandida = ref(null)

// Formulario
const nuevaNoticia = ref({
  titulo: "",
  contenido: ""
})

// Cargar noticias desde el backend (json-server o API real)
onMounted(async () => {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error("Error al cargar las noticias")
    noticias.value = await res.json()
  } catch (error) {
    console.error("Error cargando noticias:", error)
  }
})

// Generar ID aleatorio
function generarId() {
  return Math.random().toString(16).slice(2, 6)
}

// Agregar noticia (POST al servidor)
async function agregarNoticia() {
  if (!nuevaNoticia.value.titulo || !nuevaNoticia.value.contenido) return

  const nueva = {
    id: generarId(),
    titulo: nuevaNoticia.value.titulo.trim(),
    contenido: nuevaNoticia.value.contenido.trim(),
    fecha: new Date().toISOString().split("T")[0]
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nueva)
    })

    if (!res.ok) throw new Error("Error al guardar la noticia")

    const noticiaCreada = await res.json()
    noticias.value.push(noticiaCreada)

    nuevaNoticia.value.titulo = ""
    nuevaNoticia.value.contenido = ""
  } catch (error) {
    console.error("Error al agregar noticia:", error)
  }
}

// Eliminar noticia (DELETE en el backend)
async function eliminarNoticia(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Error al eliminar noticia")
    noticias.value = noticias.value.filter((n) => n.id !== id)
  } catch (error) {
    console.error("Error eliminando noticia:", error)
  }
}

// Mostrar resumen o texto completo
function resumen(texto) {
  return texto.length > 126 ? texto.slice(0, 126) + "…" : texto
}

function contenidoLimitado(texto) {
  return texto.length > 256 ? texto.slice(0, 256) + "…" : texto
}

function toggleExpand(id) {
  noticiaExpandida.value = noticiaExpandida.value === id ? null : id
}
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
  overflow: hidden;
}
.card-footer {
  background: #f8f9fa;
}
</style>
