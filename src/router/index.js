import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {path:'/', redirect:{name:'signin'}},

    {path: '/signin', name: 'signin', component: () => import('@/views/sign/signIn.vue')},
    {path: '/signup', name: 'signup', component: () => import('@/views/sign/signUp.vue')},
    {path: '/recover-password', name: 'recoverPassword', component: () => import('@/views/sign/recoverPassword.vue')},

    {path: '/u', name: 'user', redirect:{name:'movimientos'}, component: () => import('@/views/u/consolaView.vue'), children:[
        {path: 'movimientos', name: 'movimientos', component: () => import('@/views/u/movimientos/movimientosView.vue')},
        {path: 'cuentas', name: 'cuentas', component: () => import('@/views/u/cuentas/cuentasView.vue'), children:[
            {path: ':id', name: 'cuentaDetalle', component: () => import('@/views/u/cuentas/cuentaDetalle.vue')},
        ]},
        {path: 'categorias', name: 'categorias', component: () => import('@/views/u/categorias/categoriasView.vue'), children:[
            {path: ':id', name: 'categoriaDetalle', component: () => import('@/views/u/categorias/categoriaDetalle.vue')},    
        ]},
        {path: 'prestamos', name: 'prestamos', component: () => import('@/views/u/prestamos/prestamosView.vue'), children:[
            {path: ':id', name: 'prestamoDetalle', component: () => import('@/views/u/prestamos/prestamoDetalle.vue')},
        ]},
        {path: 'usuario', name: 'usuario', component: () => import('@/views/u/usuario/usuarioView.vue')},
        {path: 'dispositivos-conectados', name: 'dispositivosConectados', component: () => import('@/views/u/usuario/dispositivosConectados.vue')},
        {path: 'personal-info', name: 'personalInfo', component: () => import('@/views/u/usuario/personalInfo.vue')},

        {path: 'reportes', name: 'reportes', component: () => import('@/views/u/reportes/reportesView.vue')},
    ]}
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
