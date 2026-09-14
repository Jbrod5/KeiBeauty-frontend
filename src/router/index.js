import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const HomeView = () => import('../views/HomeView.vue')
const CatalogView = () => import('../views/CatalogView.vue')
const CartView = () => import('../views/CartView.vue')
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
<<<<<<< HEAD
const ProductDetailView = () => import('../views/ProductDetailView.vue')
=======
>>>>>>> feat/auth

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
<<<<<<< HEAD
    path: '/producto/:id',
    name: 'product-detail',
    component: ProductDetailView,
    meta: { requiresAuth: false }
  },
  {
=======
>>>>>>> feat/auth
    path: '/carrito',
    name: 'cart',
    component: CartView,
    meta: { requiresAuth: false }
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