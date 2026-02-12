<template>
  <div class="container mt-4">
    <h2>Mi Cesta</h2>

    <!-- Mensaje cesta vacía -->
    <div v-if="cesta.items.length === 0" class="alert alert-info">
      La cesta está vacía.
    </div>

    <!-- Mensaje autenticación requerida -->
    <div
      v-if="!estaAutenticado && cesta.items.length > 0"
      class="alert alert-warning d-flex justify-content-between align-items-center"
    >
      <span>
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        Tienes que iniciar sesión para continuar con la compra
      </span>
      <router-link to="/login" class="btn btn-primary btn-sm">
        Iniciar Sesión
      </router-link>
    </div>

    <!-- Campo de cupón -->
    <div v-if="cesta.items.length > 0" class="d-flex align-items-center mb-3">
      <input
        type="text"
        class="form-control form-control-sm me-2"
        placeholder="Introduce cupón"
        v-model="cupon"
        :disabled="cuponAplicado"
      />
      <button
        class="btn btn-outline-primary btn-sm"
        @click="aplicarCupon"
        :disabled="cuponAplicado"
      >
        {{ cuponAplicado ? "Cupón aplicado" : "Aplicar" }}
      </button>
    </div>

    <!-- Descuento aplicado -->
    <div v-if="descuento > 0" class="alert alert-success py-1">
      Cupón aplicado: -{{ descuento.toFixed(2) }}€
    </div>

    <!-- Tabla de productos -->
    <div v-if="cesta.items.length > 0">
      <table class="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cesta.items" :key="item.id">
            <td>{{ item.nombre }}</td>
            <td>{{ item.precio.toFixed(2) }}€</td>
            <td>
              <button
                class="btn btn-sm btn-outline-secondary me-1"
                @click="decrementar(item.id)"
              >
                -
              </button>
              {{ item.cantidad }}
              <button
                class="btn btn-sm btn-outline-secondary ms-1"
                @click="incrementar(item.id)"
              >
                +
              </button>
            </td>
            <td>{{ (item.precio * item.cantidad).toFixed(2) }}€</td>
            <td>
              <button
                class="btn btn-sm btn-danger"
                @click="removeProducto(item.id)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="fw-bold">
            <td colspan="3" class="text-end">Subtotal:</td>
            <td>{{ cesta.totalPrecio.toFixed(2) }}€</td>
            <td></td>
          </tr>
          <tr v-if="envio > 0" class="fw-bold">
            <td colspan="3" class="text-end">Envío (5%):</td>
            <td>{{ envio.toFixed(2) }}€</td>
            <td></td>
          </tr>
          <tr class="fw-bold">
            <td colspan="3" class="text-end">Descuento:</td>
            <td>-{{ descuento.toFixed(2) }}€</td>
            <td></td>
          </tr>
          <tr class="fw-bold">
            <td colspan="3" class="text-end">Total:</td>
            <td>{{ (cesta.totalPrecio + envio - descuento).toFixed(2) }}€</td>
            <td>
              <button
                class="btn btn-success btn-sm justify-content-end mx-3"
                @click="iniciarPago"
              >
                Pago
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useCestaStore } from "@/store/cesta.js";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";

// Store de la cesta
const cesta = useCestaStore();
const router = useRouter();

// Estado cupón y descuento
const cupon = ref("");
const descuento = ref(0);
const cuponAplicado = ref(false);

// Envío como porcentaje
const porcentajeEnvio = 0.05;
const envio = computed(() => {
  if (cesta.items.length > 0 /* && cesta.totalPrecio < 20000 */) {
    return cesta.totalPrecio * porcentajeEnvio;
  }
  return 0;
});

// Computed para autenticación
const estaAutenticado = computed(() => sessionStorage.getItem("token") !== null);

// Funciones de la cesta
const incrementar = (id) => cesta.incrementar(id);
const decrementar = (id) => cesta.decrementar(id);
const removeProducto = (id) => cesta.removeProducto(id);

// Función de alerta rápida
const mostrarAlerta = (title, text, icon) => {
  Swal.fire({ title, text, icon });
};

// Aplicar cupón
const aplicarCupon = () => {
  if (cuponAplicado.value) {
    mostrarAlerta("Aviso", "Ya se ha aplicado un cupón", "info");
    return;
  }

  if (!cupon.value.trim()) {
    mostrarAlerta("Aviso", "Introduce un código de cupón válido", "warning");
    return;
  }

  // Solo cupones del 10%
  const cuponesDisponibles = {
    "DESCUENTO10": 0.1,
    "OFF10": 0.1,
  };

  const valor = cuponesDisponibles[cupon.value.trim().toUpperCase()];

  if (!valor) {
    mostrarAlerta("Error", "Cupón no válido", "error");
    descuento.value = 0;
    return;
  }

  descuento.value = cesta.totalPrecio * valor;
  cuponAplicado.value = true;
  Swal.fire("Éxito", `Descuento aplicado: ${descuento.value.toFixed(2)}€`, "success");
};

// Iniciar pago
const iniciarPago = async () => {
  if (!cesta.items.length) {
    mostrarAlerta("Aviso", "La cesta está vacía", "warning");
    return;
  }

  const token = sessionStorage.getItem("token");
  if (!token) {
    Swal.fire({
      title: "Autenticación requerida",
      text: "Tienes que iniciar sesión para continuar con la compra",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Iniciar Sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) router.push("/login");
    });
    return;
  }

  try {
    // Guardar datos localmente
    localStorage.setItem(
      "ultimaCompra",
      JSON.stringify({
        items: cesta.items,
        subtotal: cesta.totalPrecio,
        descuento: descuento.value,
        envio: envio.value,
        cupon: cupon.value,
        fecha: new Date().toISOString(),
      })
    );

    // Enviar items y descuento al backend
    const response = await axios.post(
      "http://localhost:5000/create-checkout-session",
      {
        items: cesta.items,
        descuento: descuento.value,
        envio: envio.value,
      }
    );

    const session = response.data;

    if (!session.url) {
      console.error("No se recibió URL de Stripe");
      mostrarAlerta("Error", "No se pudo iniciar el pago", "error");
      return;
    }

    // Redirigir al checkout
    window.location.href = session.url;
  } catch (error) {
    console.error("Error en iniciarPago:", error);
    mostrarAlerta("Error", "No se pudo iniciar el pago", "error");
  }
};
</script>
