# KeiBeauty Frontend

Frontend del e-commerce KeiBeauty para productos K-Beauty (belleza coreana). Construido con Vue 3, Vite, Vue Router, Pinia y Axios.

## Stack Tecnológico

- **Vue 3** - Composition API con `<script setup>`
- **Vite** - Build tool y dev server
- **Vue Router 4** - Enrutamiento SPA
- **Pinia** - Gestión de estado global
- **Axios** - Cliente HTTP para API REST
- **Docker & Nginx** - Contenedorización multi-etapa para producción

## Estructura del Proyecto

```
KeiBeauty-frontend/
├── index.html                 # Entry point HTML
├── package.json               # Dependencias y scripts
├── vite.config.js             # Configuración Vite
├── .env                       # Variables de entorno (no versionar)
├── .env.example               # Ejemplo de variables de entorno
├── .gitignore                 # Archivos ignorados por Git
├── Dockerfile                 # Multi-stage build (Node → Nginx)
├── nginx.conf                 # Configuración Nginx para SPA
├── README.md                  # Este archivo
└── src/
    ├── main.js                # Bootstrap de la app
    ├── App.vue                # Layout principal + header/nav
    ├── router/
    │   └── index.js           # Rutas y guards de autenticación
    ├── stores/
    │   ├── authStore.js       # Pinia store: auth, usuario, tokens
    │   └── cartStore.js       # Pinia store: carrito de compras
    ├── services/
    │   └── api.js             # Instancia Axios + endpoints API
    ├── views/
    │   ├── HomeView.vue       # Página de inicio (hero, features)
    │   ├── CatalogView.vue    # Catálogo de productos
    │   ├── ProductDetailView.vue # Detalle de producto
    │   ├── LoginView.vue      # Formulario de login
    │   └── RegisterView.vue   # Formulario de registro
    ├── components/            # Componentes reutilizables (futuro)
    └── assets/                # Estilos globales, imágenes (futuro)
```

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API backend | `http://localhost:5000/api` |

Crear archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
# Editar .env con la URL correcta del backend
```

## Instalación y Ejecución

### Requisitos Previos

- **Node.js 18+** y **npm**
- **Docker** y **Docker Compose** (para producción)
- Backend KeiBeauty corriendo en `http://localhost:5000` (ver repositorio backend)

### Linux (Ubuntu/Debian/Fedora/Arch)

#### Desarrollo Local

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd KeiBeauty-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env si el backend no está en localhost:5000

# 4. Ejecutar en modo desarrollo
npm run dev
# Servidor disponible en http://localhost:5173
```

#### Con Docker (Producción)

```bash
# 1. Construir imagen
docker build -t keibeauty-frontend .

# 2. Ejecutar contenedor
docker run -d -p 80:80 --name keibeauty-frontend keibeauty-frontend

# O con docker-compose (si existe docker-compose.yml en raíz del proyecto)
docker compose up --build -d frontend
```

### Windows con WSL2

#### Opción A: Desarrollo en WSL (Recomendado)

```powershell
# 1. Abrir terminal WSL (Ubuntu)
wsl

# 2. Navegar al proyecto (montado en /mnt/c/... o clonado dentro de WSL)
cd /home/usuario/KeiBeauty-frontend

# 3. Seguir pasos de "Linux - Desarrollo Local"
npm install
cp .env.example .env
npm run dev
```

#### Opción B: Docker Desktop + WSL2

```powershell
# 1. Instalar Docker Desktop para Windows
#    - Habilitar "Use WSL 2 based engine"
#    - En Settings > Resources > WSL Integration, activar Ubuntu

# 2. En PowerShell (directorio del proyecto)
docker build -t keibeauty-frontend .
docker run -d -p 80:80 keibeauty-frontend
```

## Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (Vite) en puerto 5173
npm run build    # Build de producción en carpeta dist/
npm run preview  # Previsualizar build de producción localmente
```

## Autenticación

### Flujo de Autenticación

1. **Registro** (`POST /api/auth/registro`)
2. **Login** (`POST /api/auth/login`) → Recibe `access_token` y `refresh_token`
3. **Tokens guardados** en `localStorage` (`access_token`, `refresh_token`)
4. **Interceptores Axios** añaden `Authorization: Bearer <access_token>` a peticiones protegidas
5. **Refresh automático** en 401 → `POST /api/auth/refresh` con `refresh_token`
6. **Logout** limpia tokens y estado de usuario

### Endpoints de Autenticación (desde `src/services/api.js`)

| Función | Endpoint | Método | Descripción |
|---------|----------|--------|-------------|
| `login(credentials)` | `/auth/login` | POST | Iniciar sesión |
| `register(userData)` | `/auth/registro` | POST | Registrar usuario |
| `getProfile()` | `/auth/perfil` | GET | Obtener perfil (requiere JWT) |
| `refreshToken(refresh)` | `/auth/refresh` | POST | Renovar access token |


### JSON de Request/Response

#### POST /api/auth/registro

**Request:**
```json
{
  "nombre": "Juan Perez",
  "email": "juan@test.com",
  "password": "password123",
  "telefono": "+34600111222",
  "direccion_envio": "Calle Test 123"
}
```

**Response (201):**
```json
{
  "mensaje": "Usuario registrado exitosamente.",
  "usuario": {
    "id": 2,
    "nombre": "Juan Perez",
    "email": "juan@test.com",
    "telefono": "+34600111222",
    "direccion_envio": "Calle Test 123",
    "rol": "cliente",
    "fecha_registro": "2026-09-14T02:23:46.506030"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST /api/auth/login

**Request:**
```json
{
  "email": "juan@test.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "mensaje": "Login exitoso.",
  "usuario": { ... },
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### GET /api/auth/perfil

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "usuario": {
    "id": 2,
    "nombre": "Juan Perez",
    "email": "juan@test.com",
    "telefono": "+34600111222",
    "direccion_envio": "Calle Test 123",
    "rol": "cliente",
    "fecha_registro": "2026-09-14T02:23:46.506030"
  }
}
```

### Store de Autenticación (`src/stores/authStore.js`)

```javascript
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

// Estado
authStore.user              // Objeto usuario actual (reactivo)
authStore.isAuthenticated   // boolean: true si hay token y usuario
authStore.isAdmin           // boolean: true si rol === 'admin'
authStore.userName          // string: nombre del usuario
authStore.loading           // boolean: petición en curso
authStore.error             // string: último error

// Acciones
await authStore.login({ email, password })
await authStore.register({ nombre, email, password, telefono?, direccion_envio? })
await authStore.fetchProfile()  // Cargar perfil al iniciar app
authStore.logout()              // Limpiar tokens y usuario
await authStore.initAuth()      // Llamar al montar app (en router guard)
```

### Guards de Ruta (`src/router/index.js`)


- **Rutas públicas**: `/`, `/catalogo`, `/producto/:id`, `/carrito`, `/login`, `/registro`
- **Rutas protegidas**: Requieren `meta.requiresAuth !== false` (por defecto true)
- **Solo invitados**: `meta.guest: true` (login, registro) → Redirige a `/` si autenticado
- **Redirección post-login**: Guarda `redirect` en query params

## Catálogo de Productos

### Endpoints de Productos (desde `src/services/api.js`)

| Función | Endpoint | Método | Descripción |
|---------|----------|--------|-------------|
| `getProducts()` | `/products` | GET | Listar productos |
| `getProductById(id)` | `/products/:id` | GET | Obtener producto |

### JSON Response - GET /api/products

```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Low pH Good Morning Gel Cleanser",
      "descripcion": "Limpiador gel suave...",
      "ingredientes_clave": "Aceite de arbol de te, BHA, centella asiatica",
      "tipo_piel": "Mixta, grasa, sensible",
      "precio": 14.90,
      "stock": 50,
      "imagen_url": "https://example.com/products/cosrx-cleanser.jpg",
      "estado": "activo",
      "marca_id": 1,
      "categoria_id": 1,

      "marca_nombre": "COSRX",
      "categoria_nombre": "Limpieza",
      "fecha_creacion": "2026-09-14T01:46:23.411889"
    }
  ],
  "message": "Productos obtenidos exitosamente."

      "fecha_creacion": "2026-09-14T01:46:23.411889"
    }
  ]

}
```

### Vista Catálogo (`src/views/CatalogView.vue`)


- Grid responsivo de productos con imagen, nombre, marca, descripción, precio en GTQ (Q)
- Botón "Añadir" → Llama a `cartStore.addItem(product)` con campos: id, nombre, marca_nombre, precio, imagen_url, quantity
- Loading state por producto mientras se añade
- Formato de moneda: `Intl.NumberFormat('es-GT', {style: 'currency', currency: 'GTQ'})`
- Fallback visual para productos sin imagen_url

### Vista Detalle de Producto (`src/views/ProductDetailView.vue`)

- Ruta: `/producto/:id`
- Galería de imagen principal
- Nombre, marca, precio en GTQ, indicador de stock (verde/amarillo/rojo)
- Descripción completa, ingredientes clave, tipo de piel, categoría, marca
- Selector de cantidad con validación contra stock disponible
- Botón "Añadir al carrito" (respeta stock)
- Botón wishlist (placeholder)

- Grid responsivo de productos
- Botón "Añadir" → Llama a `cartStore.addItem(product)`
- Loading state por producto mientras se añade
- Filtros preparados (comentados, por categoría)


## Carrito de Compras

### Store (`src/stores/cartStore.js`)

```javascript
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()

// Estado reactivo
<<<<<<< HEAD
<<<<<<< HEAD
cartStore.items          // Array de items { id, nombre, marca_nombre, precio, imagen_url, quantity }
cartStore.totalItems     // Computed: suma de quantities
cartStore.totalPrice     // Computed: suma de precio * quantity
=======
cartStore.items          // Array de items { id, name, brand, price, emoji, quantity }
cartStore.totalItems     // Computed: suma de quantities
cartStore.totalPrice     // Computed: suma de price * quantity
>>>>>>> feat/auth
=======
cartStore.items          // Array de items { id, producto_id, nombre, marca_nombre, precio, imagen_url, cantidad, subtotal }
cartStore.totalItems     // Computed: suma de quantities
cartStore.totalPrice     // Computed: suma de subtotal
cartStore.loading        // boolean: carga en curso
cartStore.error          // string: último error
>>>>>>> feature/carrito-backend

// Acciones (sincronizan con backend)
await cartStore.fetchCart()           // Cargar carrito desde backend
await cartStore.addItem(product)      // Añadir item (POST /api/carrito/items)
await cartStore.updateQuantity(id, qty) // Actualizar cantidad (PUT /api/carrito/items/<id>)
await cartStore.removeItem(itemId)    // Eliminar item (DELETE /api/carrito/items/<id>)
await cartStore.clearCart()           // Vaciar carrito (DELETE /api/carrito)
cartStore.setItems([])                // Sincronizar manualmente
```

### Flujo "Añadir al Carrito" (con backend)


1. Usuario clicca "Añadir" en `CatalogView.vue` o `ProductDetailView.vue`
2. `cartStore.addItem(product)` → actualización optimista en UI + POST /api/carrito/items
3. Si éxito: reemplaza con respuesta del backend (incluye IDs reales, subtotales)
4. Si error: rollback automático + muestra error
5. Badge en header actualiza `cartCount` reactivamente
6. Vista `/carrito` muestra items con cantidades, subtotales y total en GTQ

### Persistencia

- **Usuario autenticado**: Carrito sincronizado con backend (persiste entre sesiones)
- **Usuario invitado**: Solo estado local en Pinia (se pierde al recargar)
- **Al hacer login**: Carrito invitado se migra automáticamente al backend
- **Al hacer logout**: Carrito local se limpia

## Formato de Moneda

Todos los precios se muestran en **Quetzales Guatemaltecos (GTQ)** usando:
```javascript
new Intl.NumberFormat('es-GT', {
  style: 'currency',
  currency: 'GTQ',
  minimumFractionDigits: 2
})
```
Ejemplo de salida: `Q 149.00`

1. Usuario clicca "Añadir" en `CatalogView.vue`
2. `cartStore.addItem(product)` añade al estado Pinia
3. Badge en header actualiza `cartCount` reactivamente
4. Persistencia: implementar `localStorage` en `cartStore` (futuro)


## Docker - Multi-stage Build

### Dockerfile

```dockerfile
# Etapa 1: Build con Node.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: Producción con Nginx Alpine
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf (SPA Optimizado)

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback - crítico para Vue Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de assets estáticos (1 año)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compresión gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Construir y Ejecutar

```bash
# Build imagen
docker build -t keibeauty-frontend .

# Ejecutar
docker run -d -p 80:80 --name keibeauty-frontend keibeauty-frontend

# Ver logs
docker logs -f keibeauty-frontend

# Detener
docker stop keibeauty-frontend
```

## Despliegue en Producción

### Variables de Entorno Producción

```env
VITE_API_URL=https://api.keibeauty.com/api
```

### Checklist Producción

- [ ] Cambiar `VITE_API_URL` a URL de producción
- [ ] Configurar `CORS_ORIGINS` en backend con dominio del frontend
- [ ] Usar secrets manager para variables sensibles (no commitear `.env`)
- [ ] Configurar HTTPS (certificados SSL en Nginx o reverse proxy)
- [ ] Habilitar cache headers en CDN/CloudFlare
- [ ] Configurar health checks en orquestador (K8s, ECS, etc.)

## Estructura de Commits (GitFlow)

```
main           # Producción
develop        # Integración continua
feature/*      # Nuevas features (ej: feature/checkout, feature/admin-panel)
hotfix/*       # Fixes urgentes en main
release/*      # Preparación releases
```

## Próximos Pasos (Roadmap)

<<<<<<< HEAD
=======
- [ ] Vista Detalle de Producto (`/producto/:id`)
>>>>>>> feat/auth
- [ ] Vista Carrito (`/carrito`) con cantidades, totales, checkout
- [ ] Checkout: dirección, envío, pago (Stripe/MercadoPago)
- [ ] Historial de Pedidos (`/mis-pedidos`)
- [ ] Panel Admin: CRUD productos, gestión pedidos, usuarios
- [ ] Persistencia carrito en `localStorage`
- [ ] Tests unitarios (Vitest) y E2E (Cypress/Playwright)
- [ ] PWA: Service Worker, manifest, offline support
- [ ] i18n: Español/Inglés

## Licencia

Proyecto privado - KeiBeauty 2024