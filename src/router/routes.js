const requireAuth = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  return !!usuario;
};

const routes = [
  // LOGIN
  { path: '/', redirect: '/login' },

  { path: '/login', component: () => import('src/components/auth/LoginForm.vue') },
  { path: '/register', component: () => import('src/components/auth/RegisterForm.vue') },

  // RUTAS DE USUARIO NORMAL
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      if (requireAuth()) next();
      else next('/login');
    },
    children: [
      { path: 'product', component: () => import('pages/PagePrincipal.vue') },

      { path: 'miperfil', component: () => import('pages/MiPerfil.vue') },
      { path: 'transacciones', component: () => import('pages/HistorialTransacciones.vue') },
      { path: 'mis-productos', component: () => import('pages/MisProductos.vue') },
      { path: 'notificaciones', component: () => import('src/pages/MisNotificaciones.vue') },
      { path: 'campanas', component: () => import('pages/CampanasCiudadano.vue') },
      { path: 'publicar', component: () => import('components/product/PublicarProducto.vue') },
      { path: 'producto/:id', component: () => import('components/product/DetalleProducto.vue') },
      { path: 'compra/:id', component: () => import('components/product/CompraProducto.vue') },
      { path: 'editar-producto/:id', component: () => import('components/product/EditarProducto.vue') }
    ]
  },

  // RUTAS DE ADMINISTRADOR
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem("usuario") || "null");

      if (!user) return next("/login");
      if (user.rol !== "administrador") return next("/product");  // <- ✔ CORREGIDO

      next();
    },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'publicaciones', component: () => import('pages/admin/GestionPublicaciones.vue') },
      { path: 'campanas', component: () => import('src/pages/admin/AdminCampanas.vue') },
      { path: 'usuarios', component: () => import('pages/admin/GestionUsuarios.vue') }
    ]
  },

  // NOT FOUND
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  }
];

export default routes;
