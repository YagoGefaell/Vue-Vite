import NotFound from '../components/NotFound.vue'
import PaginaInicio from '../components/PaginaInicio.vue'
import GestionClientes from '../components/GestionClientes.vue'
import Login from '../components/Login.vue'
import Noticias from '../components/Noticias.vue'
import Modelos from '../components/Modelos.vue'
import AvisoLegal from '../components/AvisoLegal.vue'
import PoliticaPrivacidad from '../components/PoliticaPrivacidad.vue'
import Coches from '../components/Coches.vue'
import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    {
        path: '/',
        name: 'Inicio',
        component: PaginaInicio
    },
    {
        path: '/clientes',
        name: 'GestionClientes',
        component: GestionClientes
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/noticias',
        name: 'Noticias',
        component: Noticias
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },
    {
        path: '/modelos',
        name: 'Modelos',
        component: Modelos
    },
    {
        path: '/aviso-legal',
        name: 'AvisoLegal',
        component: AvisoLegal
    },
    {
        path: '/politica-privacidad',
        name: 'PoliticaPrivacidad',
        component: PoliticaPrivacidad
    },
    {
        path: '/coches',
        name: 'Coches',
        component: Coches
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router