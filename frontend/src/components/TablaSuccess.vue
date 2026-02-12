<template>
  <div class="container mt-5 text-center">
    <div class="success-card p-5">
      <div class="mb-4">
        <i
          class="bi bi-check-circle-fill text-success"
          style="font-size: 5rem"
        ></i>
      </div>
      <h1 class="text-success mb-3">¡Pago Completado! 🎉</h1>
      <p class="lead mb-4">
        Gracias por tu compra. Te hemos enviado un correo con los detalles.
      </p>

      <div class="invoice-container mb-4">
        <button @click="generarFacturaPDF" class="btn btn-primary">
          <i class="bi bi-filetype-pdf"></i> Descargar Factura
        </button>
      </div>

      <router-link to="/ventas" class="back-link">
        <i class="bi bi-arrow-left"></i> Volver a la tienda
      </router-link>
    </div>
  </div>
</template>

<script setup>
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useCestaStore } from "@/store/cesta.js";
import { addFactura } from "@/api/facturas.js";
import logo from "@/assets/TeisMotor.png";
import { updateEstadoArticulo } from "@/api/articulos.js";

const cesta = useCestaStore();
const cartItems = ref([]);
const totalPrice = ref(0);
const descuento = ref(0);
const envio = ref(0);
const numeroFactura = ref(Math.floor(Math.random() * 1000000));

// --- Función para guardar factura en MongoDB ---
const guardarFacturaEnBD = async () => {
  try {
    const usuario = sessionStorage.getItem("nombre") || "Cliente";

    const factura = {
      numeroFactura: numeroFactura.value,
      fecha: new Date().toISOString(),
      cliente: usuario,
      items: cartItems.value.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        total: item.precio * item.cantidad,
      })),
      subtotal: totalPrice.value,
      descuento: descuento.value,
      envio: envio.value,
      total: totalPrice.value - descuento.value + envio.value,
      estado: "Completado",
    };

    const resultado = await addFactura(factura);
    console.log("✅ Factura guardada en MongoDB:", resultado);
  } catch (error) {
    console.error("❌ Error al guardar la factura en MongoDB:", error);
  }
};

// --- Función para marcar vehículos como vendidos ---
const guardarVehiculosVendidos = async () => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No hay token, no se puede actualizar el estado.");
      return;
    }

    for (const item of cartItems.value) {
      await updateEstadoArticulo(item.id, "vendido");
    }
    console.log("✅ Vehículos marcados como vendidos en la base de datos");
  } catch (error) {
    console.error("❌ Error al actualizar estado de vehículos:", error);
  }
};

// --- Función para generar PDF de factura ---
const generarFacturaPDF = () => {
  if (cartItems.value.length === 0) return;

  const doc = new jsPDF();
  const cart = cartItems.value;

  // Logo
  doc.addImage(logo, "PNG", 10, 10, 30, 30);

  // Título y detalles
  doc.setFontSize(18);
  doc.text("Factura de Compra", 50, 25);
  doc.setFontSize(11);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 50, 34);
  doc.text(`Factura Nº: ${numeroFactura.value}`, 50, 40);

  // Info cliente
  doc.setFontSize(9);
  doc.text("Razón Social: Regalos Teis", 110, 50);
  doc.text("Dirección: Avenida Galicia 101, Vigo - 36216", 110, 55);
  doc.text("Tlfo: 986 666 333 - Email: regalos@example.com", 110, 60);

  // Tabla de productos
  const tableBody = cart.map((item) => [
    item.id || "N/A",
    item.nombre || "Producto",
    item.cantidad || 1,
    `${(item.precio || 0).toFixed(2)} €`,
    `${((item.cantidad || 1) * (item.precio || 0)).toFixed(2)} €`,
  ]);

  // Descuento
  if (descuento.value > 0) {
    tableBody.push(["", "Descuento aplicado", "", "", `-${descuento.value.toFixed(2)} €`]);
  }

  // Envío
  if (envio.value > 0) {
    tableBody.push(["", "Gastos de envío", "", "", `${envio.value.toFixed(2)} €`]);
  }

  autoTable(doc, {
    startY: 80,
    head: [["ID", "Producto", "Cantidad", "Precio Unitario", "Total"]],
    body: tableBody,
    theme: "striped",
    columnStyles: {
      0: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
    styles: { fontSize: 10 },
  });

  // Total final
  const totalFinal = cart.reduce(
    (acc, item) => acc + (item.precio || 0) * (item.cantidad || 1),
    0
  ) - descuento.value + envio.value;

  const totalText = `Total final: ${totalFinal.toFixed(2)} €`;
  const pageWidth = doc.internal.pageSize.width;
  const totalWidth = doc.getTextWidth(totalText);
  const positionX = pageWidth - totalWidth - 14;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(totalText, positionX, doc.lastAutoTable.finalY + 10);

  doc.save("factura.pdf");
};

// --- onMounted: cargar datos de la última compra ---
onMounted(async () => {
  const ultimaCompra = localStorage.getItem("ultimaCompra");

  if (ultimaCompra) {
    const compraData = JSON.parse(ultimaCompra);
    cartItems.value = compraData.items;
    totalPrice.value = compraData.total;
    descuento.value = compraData.descuento || 0;
    envio.value = compraData.envio || 0;

    await guardarFacturaEnBD();
    await guardarVehiculosVendidos(); // 🔹 marcar vehículos como vendidos
  }

  cesta.vaciarCesta();
  localStorage.removeItem("ultimaCompra");
});

onBeforeUnmount(() => {
  if (localStorage.getItem("ultimaCompra")) localStorage.removeItem("ultimaCompra");
});
</script>

<style scoped>
.success-card {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
}

.bi-check-circle-fill {
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
