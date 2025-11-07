<template>
  <div class="d-flex align-items-center justify-content-center bg-light flex-grow-1 py-5" style="min-height: calc(100vh - 160px);">
    <div class="card shadow-lg border-0 rounded-4 p-4" style="max-width: 420px; width: 100%;">
      <div class="card-body">
        <div class="text-center mb-4">
          <i class="bi bi-person-circle text-primary" style="font-size: 3rem;"></i>
          <h4 class="mt-2 fw-semibold">Iniciar Sesión</h4>
          <p class="text-muted small">Accede a tu cuenta para continuar</p>
        </div>

        <form @submit.prevent="login">
          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label fw-semibold">Correo electrónico</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="form-control"
              :class="{ 'is-invalid': emailError }"
              placeholder="tucorreo@ejemplo.com"
              required
            />
            <div class="invalid-feedback">{{ emailError }}</div>
          </div>

          <!-- Contraseña -->
          <div class="mb-3">
            <label for="password" class="form-label fw-semibold">Contraseña</label>
            <div class="input-group">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                id="password"
                class="form-control"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="showPassword = !showPassword"
                tabindex="-1"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Error global -->
          <div v-if="loginError" class="alert alert-danger py-2 small text-center">
            {{ loginError }}
          </div>

          <!-- Botón -->
          <div class="d-grid mt-4">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="!loading">
                <i class="bi bi-box-arrow-in-right me-1"></i> Entrar
              </span>
              <span v-else>
                <span class="spinner-border spinner-border-sm me-2"></span>
                Iniciando...
              </span>
            </button>
          </div>
        </form>

        <!-- Enlace registro -->
        <div class="text-center mt-3">
          <p class="mb-0 small text-muted">
            ¿No tienes cuenta?
            <a href="/register" class="text-decoration-none fw-semibold text-primary">Regístrate</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
body {
  background-color: #f8f9fa;
}

.card {
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.btn-primary {
  font-weight: 500;
  border-radius: 0.5rem;
}

.input-group .btn {
  border-color: #ced4da;
}
</style>
