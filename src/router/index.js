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
const AdminOrdersView = () => import('../views/AdminOrdersView.vue')


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
    meta: { requiresAuth: true }
  },
  {
    path: '/mis-pedidos',
    name: 'order-history',
    component: OrderHistoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/pedidos',
    name: 'admin-orders',
    component: AdminOrdersView,
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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth === true)
  const guestOnly = to.matched.some(record => record.meta.guest === true)

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