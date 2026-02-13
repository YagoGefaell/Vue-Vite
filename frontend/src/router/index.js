import NotFound from "../components/NotFound.vue";
import PaginaInicio from "../components/PaginaInicio.vue";
import GestionClientes from "../components/GestionClientes.vue";
import Noticias from "../components/Noticias.vue";
import AvisoLegal from "../components/AvisoLegal.vue";
import PoliticaPrivacidad from "../components/PoliticaPrivacidad.vue";
import Modelos from "../components/Modelos.vue";
import Ventas from "../components/Ventas.vue";
import CitasTaller from "../components/CitasTaller.vue";
import { createRouter, createWebHistory } from "vue-router";
import TablaLogin from "../components/TablaLogin.vue";
import { esAdmin } from "../api/authApi";
import Contacto from "../components/Contacto.vue";
import ListaModelos from "../components/ListaModelos.vue";
import Buscar from "../components/Buscar.vue";
import TablaSuccess from "../components/TablaSuccess.vue";
import TablaCanceL from "../components/TablaCanceL.vue";
import Pedidos from "../components/Pedidos.vue";
import Cesta from "../components/Cesta.vue";
import Empleo from "../components/Empleo.vue";
import Solicitudes from "../components/Solicitudes.vue";
import GestionReservas from "../components/GestionReservas.vue";

const routes = [
  {
    path: "/",
    name: "Inicio",
    component: PaginaInicio,
  },
  {
    path: "/clientes",
    name: "GestionClientes",
    component: GestionClientes,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/noticias",
    name: "Noticias",
    component: Noticias,
  },
  {
    path: "/avisolegal",
    name: "AvisoLegal",
    component: AvisoLegal,
  },
  {
    path: "/politica-privacidad",
    name: "PoliticaPrivacidad",
    component: PoliticaPrivacidad,
  },
  {
    path: "/modelos",
    name: "Modelos",
    component: Modelos,
    meta: { requiresAdmin: true },
  },
  {
    path: "/ventas",
    name: "Ventas",
    component: Ventas,
  },
  {
    path: "/citas-taller",
    name: "CitasTaller",
    component: CitasTaller,
    meta: { requiresAdmin: true },
  },
  {
    path: "/login",
    name: "TablaLogin",
    component: TablaLogin,
  },
  {
    path: "/contacto",
    name: "Contacto",
    component: Contacto,
  },
  {
    path: "/buscar",
    name: "Buscar",
    component: Buscar,
  },
  {
    path: "/pedidos",
    name: "Pedidos",
    component: Pedidos,
  },
  {
    path: "/listamodelos",
    name: "ListaModelos",
    component: ListaModelos,
  },
  {
    path: "/cesta",
    name: "Cesta",
    component: Cesta,
  },
  {
    path: "/success",
    name: "TablaSuccess",
    component: TablaSuccess,
  },
  {
    path: "/cancel",
    name: "TablaCanceL",
    component: TablaCanceL,
  },
  {
    path: "/empleo",
    name: "Empleo",
    component: Empleo,
    meta: { requiresNoAdmin: true },
  },
  {
    path: "/solicitudes",
    name: "Solicitudes",
    component: Solicitudes,
    meta: { requiresAdmin: true },
  },
  {
    path: "/gestion-reservas",
    name: "GestionReservas",
    component: GestionReservas,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = sessionStorage.getItem("token");
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";

  // Si la ruta requiere ser admin
  if (to.meta.requiresAdmin) {
    // Si no hay token → al login
    if (!token) return next({ name: "TablaLogin" });

    // Consultar al backend si es admin
    const admin = await esAdmin();

    if (!admin) {
      return next({ name: "Inicio" }); // acceso denegado
    }
  }

  // Si la ruta requiere NO ser admin (usuarios normales)
  if (to.meta.requiresNoAdmin) {
    if (isAdmin) {
      return next({ name: "Inicio" }); // admin no puede acceder
    }
  }

  next();
});

export default router;
