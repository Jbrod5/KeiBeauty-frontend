# CONFIGURACIÓN DEL AGENTE - KEIBEAUTY FRONTEND

## Contexto de Negocio
- **Proyecto:** Kei Beauty (E-commerce de productos coreanos de belleza).
- **Propósito:** Interfaz de usuario intuitiva y reactiva para que los clientes exploren el catálogo K-Beauty, filtren por tipo de piel/categoría, gestionen su carrito de compras y completen su pedido. Incluye un panel administrativo básico para gestión de productos.
- **Vistas Principales:** Inicio/Catálogo, Detalle de Producto, Carrito/Checkout, Login/Registro, Historial de Pedidos y Panel Admin.

## Stack Tecnológico
- **Framework/Herramientas:** Vue.js 3 (Composition API con `<script setup>`), Vite, Vue Router, Pinia, Axios.
- **Estrategia de Ramas:** GitFlow (`main`, `develop`, `feature/*`).

## Habilidades Vinculadas
- `convenciones-vue`: Reglas de arquitectura, reactivación, diseño y consumo de API para componentes de Vue 3.
- `docker-vue`: Directrices para compilar la app con Vite y servir los estáticos usando un contenedor Nginx optimizado.

## Reglas para el Asistente
1. Responder siempre en español.
2. Priorizar una experiencia de usuario fluida, limpia y adaptada a la estética del cuidado personal / K-Beauty.
3. Manejar el estado global del carrito y la sesión de usuario mediante tiendas de Pinia de forma estricta.
