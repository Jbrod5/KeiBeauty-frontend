import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const HomeView = () => import('../views/HomeView.vue')
const CatalogView = () => import('../views/CatalogView.vue')
const CartView = () => import('../views/CartView.vue')
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const ProductDetailView = () => import('../views/ProductDetailView.vue')
const ForgotPasswordView = () => import('../views/ForgotPasswordView.vue')
const ResetPasswordView = () => import('../views/ResetPasswordView.vue')
const CheckoutView = () => import('../views/CheckoutView.vue')
const OrderHistoryView = () => import('../views/OrderHistoryView.vue')
const AdminCategoriesView = () => import('../views/AdminCategoriesView.vue')
const AdminOrdersView = () => import('../views/AdminOrdersView.vue')
const AdminDashboardView = () => import('../views/AdminDashboardView.vue')
const ProfileView = () => import('../views/ProfileView.vue')
import AdminProductsView from '../views/AdminProductsView.vue'
const OrderDetailView = () => import('../views/OrderDetailView.vue')
const TwoFactorView = () => import('../views/TwoFactorView.vue')
const FavoritosView = () => import('../views/FavoritosView.vue')


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: false }
  },
  {
    path: '/catalogo',
    name: 'catalog',
    component: CatalogView,
    meta: { requiresAuth: false }
  },
  {
    path: '/producto/:id',
    name: 'product-detail',
    component: ProductDetailView,
    meta: { requiresAuth: false }
  },
  {
    path: '/carrito',
    name: 'cart',
    component: CartView,
    meta: { requiresAuth: false }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView,
    meta: { requiresAuth: false }
  },
  {
    path: '/perfil',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil/favoritos',
    name: 'favoritos',
    component: FavoritosView,
    meta: { requiresAuth: true }
  },
  {
    path: '/mis-pedidos',
    name: 'order-history',
    component: OrderHistoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/mis-pedidos/:id',
    name: 'order-detail',
    component: OrderDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/categorias',
    name: 'admin-categorias',
    component: AdminCategoriesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/resenas',
    name: 'admin-resenas',
    component: () => import('../views/AdminResenasView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/marcas',
    name: 'admin-marcas',
    component: () => import('../views/AdminMarcasView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/productos',
    name: 'admin-productos',
    component: AdminProductsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/pedidos',
    name: 'admin-orders',
    component: AdminOrdersView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/pedidos/:id',
    name: 'admin-order-detail',
    component: OrderDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guest: true }
  },
  {
    path: '/registro',
    name: 'register',
    component: RegisterView,
    meta: { guest: true }
  },
  {
    path: '/olvide-contrasena',
    name: 'forgot-password',
    component: ForgotPasswordView,
    meta: { guest: true }
  },
  {
    path: '/reestablecer-contrasena',
    name: 'reset-password',
    component: ResetPasswordView,
    meta: { guest: true }
  },
  {
    path: '/verificar-2fa',
    name: 'verify-2fa',
    component: TwoFactorView,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Esperar a que initAuth termine si hay access_token pero no user
  if (authStore.accessToken && !authStore.user) {
    await authStore.initAuth()
  }

  // Si después de initAuth hay accessToken pero no user (token expirado y no se pudo refrescar),
  // limpiar tokens y tratar como no autenticado
  if (authStore.accessToken && !authStore.user) {
    authStore.clearTokens()
    authStore.clearUser()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth === true)
  const guestOnly = to.matched.some(record => record.meta.guest === true)

  // Si está en flujo 2FA y no va a /verificar-2fa ni /login, redirigir a /verificar-2fa
  if (authStore.isIn2FAFlow && to.name !== 'verify-2fa' && to.name !== 'login') {
    next({ name: 'verify-2fa' })
    return
  }

  // Si va a /verificar-2fa pero no hay flujo 2FA activo, redirigir a login
  if (to.name === 'verify-2fa' && !authStore.isIn2FAFlow) {
    next({ name: 'login' })
    return
  }

  if (guestOnly && authStore.isAuthenticated) {
    next('/')
    return
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  next()
})

export default router