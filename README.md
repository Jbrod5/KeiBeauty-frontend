# KeiBeauty Frontend

Interfaz del e-commerce **KeiBeauty** (nombre comercial en redes: **Kei Esencia**),
empresa guatemalteca de K-Beauty (skincare y haircare) fundada en 2021 en
Quetzaltenango. SPA donde los clientes exploran el catálogo con filtros,
gestionan carrito y favoritos, compran como invitados o registrados, siguen sus
pedidos y reciben notificaciones; incluye panel administrativo completo
(productos, marcas, categorías, pedidos con guía, reseñas y reportes con Excel).

Proyecto de Seminario de Sistemas 1 — USAC-CUNOC. Fase 2.

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Vue 3 | ^3.4.0 | Composition API con `<script setup>` |
| Vite | ^5.0.0 | Dev server y build |
| Vue Router | ^4.3.0 | Enrutamiento SPA + guards |
| Pinia | ^2.1.0 | Estado global (auth, carrito, favoritos, notificaciones) |
| Axios | ^1.6.0 | Cliente HTTP con interceptores JWT/guest |
| Bootstrap | ^5.3.8 | Framework CSS (único; CSS custom solo si Bootstrap no cubre) |
| Bootstrap Icons | ^1.13.1 | Iconos vectoriales (prohibidos los emojis) |
| vue-toastification | ^2.0.0-rc.5 | Toasts en español |
| Docker + Nginx | — | Producción multi-etapa (`dist/` servido por Nginx) |

## Requisitos previos

- Node.js 18+ y npm (o pnpm)
- Docker (opcional, solo para despliegue de producción)
- Backend corriendo en `http://localhost:5000` (ver README del backend)
- Git

> **Windows/WSL:** `git config core.autocrlf true`. Se recomienda desarrollar en WSL2.

## Instalación en local

```bash
git clone <url-del-repo> KeiBeauty-frontend
cd KeiBeauty-frontend

# 1. Variables de entorno
cp .env.example .env
# Revisar VITE_API_URL (por defecto http://localhost:5000/api)

# 2. Instalar dependencias
npm install

# 3. Desarrollo (http://localhost:5173)
npm run dev

# 4. Build de producción (verificación obligatoria antes de mergear)
npm run build

# 5. Vista previa del build (opcional)
npm run preview
```

Despliegue con Docker (producción):

```bash
docker build -t keibeauty-frontend .
docker run -p 80:80 keibeauty-frontend
```

> Nota: `VITE_*` se inyecta en tiempo de **compilación**; si cambia
> `VITE_API_URL` hay que reconstruir la imagen.

## Variables de entorno

| Variable | Obligatoria | Descripción | Ejemplo |
|---|---|---|---|
| `VITE_API_URL` | Sí | URL base de la API (sin `/` final) | `http://localhost:5000/api` |
| `VITE_WHATSAPP_URL` | No | Enlace de contacto WhatsApp | `https://wa.me/50239718418?text=Hola...` |

## Estructura del proyecto

```
KeiBeauty-frontend/
├── index.html               # Entry HTML
├── package.json             # Dependencias y scripts (dev/build/preview)
├── vite.config.js           # Vite (puerto 5173, plugin Vue)
├── .env.example             # Plantilla (VITE_API_URL, VITE_WHATSAPP_URL)
├── Dockerfile               # Multi-etapa: node build → nginx production
├── nginx.conf               # SPA fallback (try_files ... /index.html)
├── src/
│   ├── main.js              # createApp + Pinia + Router + Toast + paleta + initAuth
│   ├── App.vue              # Navbar (catálogo, sobre nosotros, carrito, avatar) + footer + WhatsApp flotante
│   ├── assets/estilos/
│   │   └── paleta.css       # Variables --kei-* + overrides Bootstrap
│   ├── router/index.js      # Rutas, redirect / → /catalogo, guards auth/2FA/guest
│   ├── services/api.js      # Instancia Axios + ~40 funciones de consumo API
│   ├── stores/
│   │   ├── authStore.js     # Sesión, tokens, 2FA, perfil
│   │   ├── cartStore.js     # Carrito (backend + guest_token)
│   │   ├── favoritosStore.js# Favoritos del usuario
│   │   └── notificacionStore.js # Notificaciones + polling 30 s
│   ├── views/               # 23 vistas (ver tabla de rutas)
│   └── components/          # (Vacío: no hay componentes reutilizables extraídos aún)
```

## Rutas de la aplicación

`/` redirige directamente a `/catalogo` (patrón de tiendas K-Beauty reales:
se entra y se ven productos). La landing informativa vive en `/sobre-nosotros`.

| Ruta | Componente | Auth | Admin | Descripción |
|---|---|---|---|---|
| `/` | — | No | — | Redirect → `/catalogo` |
| `/config-api` | `ConfigApiView.vue` | No | — | Fija la URL del backend (manual o `?api=<url>`); probar conexión |
| `/sobre-nosotros` | `HomeView.vue` | No | — | Landing "Sobre nosotros" (empresa, marcas, skincare/haircare) |
| `/catalogo` | `CatalogView.vue` | No | — | Catálogo con búsqueda (debounce), filtros categoría/marca, favoritos, añadir al carrito |
| `/producto/:id` | `ProductDetailView.vue` | No | — | Galería, stock, reseñas, cantidad, alerta "avísame" |
| `/carrito` | `CartView.vue` | No | — | Carrito (invitado + autenticado) |
| `/checkout` | `CheckoutView.vue` | No | — | Checkout autenticado o invitado (email/teléfono/dirección) |
| `/login` | `LoginView.vue` | Invitado | — | Login (deriva a 2FA si aplica) |
| `/registro` | `RegisterView.vue` | Invitado | — | Registro de cliente |
| `/olvide-contrasena` | `ForgotPasswordView.vue` | Invitado | — | Solicita email de recuperación |
| `/reestablecer-contrasena` | `ResetPasswordView.vue` | Invitado | — | Nueva contraseña con token del email |
| `/verificar-2fa` | `TwoFactorView.vue` | Flujo 2FA | — | Código de 6 dígitos (solo con `temp_token`) |
| `/perfil` | `ProfileView.vue` | Sí | — | Datos del usuario + activar/desactivar 2FA |
| `/perfil/favoritos` | `FavoritosView.vue` | Sí | — | Lista de favoritos |
| `/mis-pedidos` | `OrderHistoryView.vue` | Sí | — | Historial con resumen |
| `/mis-pedidos/:id` | `OrderDetailView.vue` | Sí | — | Detalle de pedido propio |
| `/admin` | `AdminDashboardView.vue` | Sí | Sí* | Dashboard admin |
| `/admin/productos` | `AdminProductsView.vue` | Sí | Sí* | CRUD + filtro + ajuste de inventario |
| `/admin/productos/crear` | `AdminProductoCrearView.vue` | Sí | Sí* | Crear producto (multipart) |
| `/admin/productos/:id/editar` | `AdminProductoEditarView.vue` | Sí | Sí* | Editar + galería de imágenes |
| `/admin/marcas` | `AdminMarcasView.vue` | Sí | Sí* | CRUD de marcas |
| `/admin/categorias` | `AdminCategoriesView.vue` | Sí | Sí* | CRUD de categorías |
| `/admin/pedidos` | `AdminOrdersView.vue` | Sí | Sí* | Pedidos + cambio de estado + guía |
| `/admin/pedidos/:id` | `OrderDetailView.vue` | Sí | Sí* | Detalle (misma vista, con acciones admin) |
| `/admin/resenas` | `AdminResenasView.vue` | Sí | Sí* | Gestión de reseñas |
| `/admin/reportes` | `AdminReportesView.vue` | Sí | Sí* | Reportes + filtros + descarga Excel |

\* El guard del router exige autenticación; la verificación de rol `admin` la
hace cada vista admin al montarse (`if (!authStore.isAdmin) router.push('/')`).
Las rutas `guest` redirigen a `/catalogo` si ya hay sesión. Si hay flujo 2FA
activo (`temp_token`), toda navegación ajena a `/verificar-2fa` se redirige ahí.

## Consumo de la API

Base: `VITE_API_URL` (`http://localhost:5000/api`). El interceptor adjunta
`Authorization: Bearer <access_token>` (o el `temp_token` solo en endpoints 2FA)
y `X-Guest-Token` para carrito invitado sin sesión.

**URL del backend dinámica (sin recompilar):** la URL efectiva se resuelve en
cada petición con `obtenerUrlBaseApi()` (`src/services/api.js`): primero
`localStorage.api_base_url` (fijada desde `/config-api`), si no `VITE_API_URL`,
si no el defecto local. Helpers: `guardarUrlBaseApi(url)`,
`restablecerUrlBaseApi()`, `hayOverrideUrlBaseApi()`. Si la URL contiene
`ngrok` se agrega el header `ngrok-skip-browser-warning: 1` automáticamente.

### Autenticación (`authStore.js` + vistas Login/Registro/Perfil/2FA/Password)

| Función en `api.js` | Endpoint | Envía (JSON) | Recibe | Usada desde |
|---|---|---|---|---|
| `login(c)` | `POST /auth/login` | `{email, password}` | `{mensaje, usuario, access_token, refresh_token}` o `{data: {requiere_2fa, email, token_temporal}}` | `authStore.login`, `LoginView` |
| `register(d)` | `POST /auth/registro` | `{nombre, email, password, telefono?, direccion_envio}` | `{mensaje, usuario, access_token, refresh_token}` (`201`) | `authStore.register`, `RegisterView` |
| `getProfile()` | `GET /auth/perfil` | — (JWT) | `{usuario}` | `authStore.fetchProfile/initAuth` |
| `refreshToken(t)` | `POST /auth/refresh` | — (JWT-refresh en header) | `{access_token}` | `authStore.tryRefreshToken` |
| `forgotPassword(e)` | `POST /auth/olvide-contrasena` | `{email}` | `{data: null, message}` | `authStore.forgotPassword`, `ForgotPasswordView` |
| `resetPassword(t,p,c)` | `POST /auth/reestablecer-contrasena` | `{token, password, confirm_password}` | `{data: null, message}` | `authStore.resetPassword`, `ResetPasswordView` |
| `verify2FA(e,c,t)` | `POST /auth/verificar-2fa` | `{codigo}` (temp JWT) | `{mensaje, usuario, access_token, refresh_token}` | `authStore.verify2FA`, `TwoFactorView` |
| `resend2FA(e,t)` | `POST /auth/reenviar-codigo-2fa` | — (temp JWT) | `{data: null, message}` | `authStore.resend2FA` |
| `cancelarLogin(t)` | `POST /auth/cancelar-login` | — (temp JWT) | `{message}` | `authStore.cancelLogin` |
| `activar2FA()` | `POST /auth/activar-2fa` | — (JWT) | `{data: {two_factor_enabled}, message}` | `authStore.activar2FA`, `ProfileView` |
| `desactivar2FA()` | `POST /auth/desactivar-2fa` | — (JWT) | `{data: {two_factor_enabled}, message}` | `authStore.desactivar2FA`, `ProfileView` |

### Catálogo y productos (`CatalogView`, `ProductDetailView`, vistas admin)

| Función | Endpoint | Envía | Recibe | Usada desde |
|---|---|---|---|---|
| `getProducts(p)` | `GET /products?categoria&marca&buscar&con_favorito` | query | `{data: [<producto>]}` | `CatalogView` |
| `getProductById(id)` | `GET /products/<id>` | — | `{data: <producto>}` | `ProductDetailView` |
| `getMarcas()` | `GET /products/marcas` | — | `{data: [...]}` | `CatalogView` (filtro) |
| `getCategories()` | `GET /products/categorias` | — | `{data: [{id, nombre}]}` | `CatalogView` (filtro) |
| `createProduct(fd)` | `POST /products` | `FormData` (multipart, admin) | `{data: <producto>}` (`201`) | `AdminProductoCrearView` |
| `updateProduct(id,d)` | `PUT /products/<id>` | JSON o `FormData` (admin) | `{data: <producto>}` | `AdminProductoEditarView` |
| `deleteProduct(id)` | `DELETE /products/<id>` | — (admin) | `{message}` | `AdminProductsView` |
| `uploadProductImage(id,f)` | `POST /products/<id>/imagen` | `FormData{archivo}` (admin) | `{data}` | `AdminProductoEditarView` |
| `getProductoImagenes(id)` | `GET /products/<id>/imagenes` | — | `{data: [...]}` | `ProductDetailView`, edición admin |
| `subirImagenesGaleria(id,fs)` | `POST /products/<id>/imagenes` | `FormData{archivos[]}` (admin) | `{data}` | `AdminProductoEditarView` |
| `marcarImagenPrincipal(pid,iid)` | `PUT /products/<pid>/imagenes/<iid>/principal` | — (admin) | `{data}` | `AdminProductoEditarView` |
| `eliminarImagenGaleria(pid,iid)` | `DELETE /products/<pid>/imagenes/<iid>` | — (admin) | `{data}` | `AdminProductoEditarView` |
| `ajustarInventario(id,t,c,costo?)` | `POST /products/<id>/inventario` | `{tipo: entrada\|salida, cantidad, costo_unitario?}` (admin) | `{data: <producto>}` | `AdminProductsView` |

Objeto `<producto>` (backend `to_dict` + `es_favorito` opcional):

```json
{
  "id": 2, "nombre": "Advanced Snail 96...",
  "descripcion": "...", "ingredientes_clave": "...",
  "tipo_piel": "Todo tipo de piel", "tamano": "100ml",
  "precio": 22.5, "stock": 40, "estado": "activo",
  "imagen_url": "https://...", "imagenes": [],
  "marca_id": 1, "marca_nombre": "COSRX",
  "categoria_id": 3, "categoria_nombre": "Tratamiento",
  "es_favorito": true
}
```

### Carrito (`cartStore.js`, `CartView`, `CheckoutView`)

| Función | Endpoint | Envía | Recibe | Usada desde |
|---|---|---|---|---|
| `getCart()` | `GET /carrito` | — (JWT o guest) | `{data: <carrito>}` | `cartStore.fetchCart` |
| `addToCart(pid,c)` | `POST /carrito/items` | `{producto_id, cantidad}` | `{data: <carrito>}` | `cartStore.addItem`, `CatalogView` |
| `updateCartItem(iid,c)` | `PUT /carrito/items/<iid>` | `{cantidad}` | `{data: <carrito>}` | `cartStore.updateQuantity` |
| `removeCartItem(iid)` | `DELETE /carrito/items/<iid>` | — | `{data: <carrito>}` | `cartStore.removeItem` |
| `clearCart()` | `DELETE /carrito` | — | `{data}` | `cartStore.clearCartItems` |

### Pedidos (`CheckoutView`, `OrderHistoryView`, `OrderDetailView`, `AdminOrdersView`)

| Función | Endpoint | Envía | Recibe | Usada desde |
|---|---|---|---|---|
| `createOrder(d)` | `POST /pedidos` | `{direccion_envio}` (+ `{email_contacto, telefono_contacto, items?}` si invitado) | `{data: <pedido>}` (`201`) | `CheckoutView` |
| `getOrders(p)` | `GET /pedidos?page&per_page&estado` | — (JWT) | `{data: [...], ...}` | `OrderHistoryView`, `AdminOrdersView` |
| `getOrderById(id,g,e)` | `GET /pedidos/<id>?guest_token&email_contacto` | — | `{data: <pedido>}` | `OrderDetailView` |
| `updateOrderStatus(id,e)` | `PATCH /pedidos/<id>/estado` | `{estado}` (admin) | `{data: <pedido>}` | `AdminOrdersView` |
| `uploadGuia(id,f)` | `PUT /pedidos/<id>/guia` | `FormData{archivo}` (admin) | `{data}` | `AdminOrdersView` |

### Favoritos, reseñas, categorías, marcas, notificaciones, reportes

| Función | Endpoint | Envía | Recibe | Usada desde |
|---|---|---|---|---|
| `getFavoritos()` | `GET /favoritos` | — (JWT) | `{data: [...]}` | `favoritosStore.fetchFavoritos` |
| `agregarFavorito(pid)` | `POST /favoritos/<pid>` | — (JWT) | `{data/message}` | `favoritosStore.agregar` |
| `quitarFavorito(pid)` | `DELETE /favoritos/<pid>` | — (JWT) | `{data/message}` | `favoritosStore.quitar` |
| `getResenas(p)` | `GET /resenas?producto=<id>` | query | `{data, promedio, total}` | `ProductDetailView` |
| `createResena(d)` | `POST /resenas` | `{producto_id, calificacion 1-5, comentario?}` (JWT) | `{data}` (`201`) | `ProductDetailView` |
| `updateResena(id,d)` | `PUT /resenas/<id>` | `{calificacion?, comentario?}` (admin) | `{data}` | `AdminResenasView` |
| `deleteResena(id)` | `DELETE /resenas/<id>` | — (admin) | `{message}` | `AdminResenasView` |
| `createCategory(d)` | `POST /categorias` | `{nombre, descripcion?}` (admin) | `{data}` (`201`) | `AdminCategoriesView` |
| `updateCategory(id,d)` | `PUT /categorias/<id>` | idem (admin) | `{data}` | `AdminCategoriesView` |
| `deleteCategory(id)` | `DELETE /categorias/<id>` | — (admin) | `{message}` | `AdminCategoriesView` |
| `createMarca(d)` | `POST /marcas` | JSON o `FormData` (admin) | `{data}` (`201`) | `AdminMarcasView` |
| `updateMarca(id,d)` | `PUT /marcas/<id>` | idem (admin) | `{data}` | `AdminMarcasView` |
| `deleteMarca(id)` | `DELETE /marcas/<id>` | — (admin) | `{message}` | `AdminMarcasView` |
| `getAlertaProducto(pid)` | `GET /notificaciones/producto/<pid>/alerta` | — (JWT) | `{data: {activa} \| null}` | `ProductDetailView` ("Avísame") |
| `crearAlertaProducto(pid)` | `POST /notificaciones/producto/<pid>/alerta` | — (JWT) | `{data/message}` | `ProductDetailView` |
| `eliminarAlertaProducto(pid)` | `DELETE /notificaciones/producto/<pid>/alerta` | — (JWT) | `{message}` | `ProductDetailView` |
| `getReportes*` (6 fns) | `GET /reportes/ventas-totales\|ventas-por-mes\|ventas-por-periodo\|ganancias\|productos-mas-vendidos\|clientes-top` | query `desde,hasta,limit` (admin) | `{data}` o `.xlsx` | `AdminReportesView` |
| `descargarExcel(url,p)` | `GET <reporte>?excel=1` | — (`responseType: blob`, admin) | archivo `.xlsx` | `AdminReportesView` |

Las notificaciones in-app (`GET /notificaciones`, `PUT .../leida`, `PUT /leer-todas`)
se consumen directo con `api.get/put` desde `notificacionStore.js` (campana en `App.vue`).

## Stores de Pinia

### `authStore.js` (`useAuthStore`, id `auth`)

- **Estado:** `user`, `accessToken`, `refreshToken`, `tempToken`, `tempEmail` (los 4
  últimos persistidos en `localStorage`), `loading`, `error`.
- **Computed:** `isAuthenticated` (access + user), `isAdmin` (`rol === 'admin'`),
  `userName`, `isIn2FAFlow` (`tempToken && tempEmail`).
- **Acciones:** `login` (deriva a 2FA si `requiere_2fa`), `register`, `verify2FA`,
  `resend2FA`, `cancelLogin`, `activar2FA/desactivar2FA`, `forgotPassword`,
  `resetPassword`, `fetchProfile` (con reintento vía refresh si expiró),
  `tryRefreshToken`, `logout` (limpia tokens, usuario, carrito y favoritos),
  `initAuth` (hidrata sesión al arrancar; llamada desde `main.js` y el guard del router).

### `cartStore.js` (`useCartStore`, id `cart`)

- **Estado:** `items`, `loading`, `error`, `guestToken` (persistido en `localStorage`).
- **Computed:** `totalItems`, `totalPrice`.
- **Acciones:** `fetchCart`, `addItem` (optimista con ítem temporal si falla la red),
  `updateQuantity` (revierte si falla), `removeItem`, `clearCartItems`,
  `setItemsFromBackend`, `syncWithBackend`. Tras login/register/2FA se recarga
  desde el backend; tras logout se vacía.

### `favoritosStore.js` (`useFavoritosStore`, id `favoritos`)

- **Estado:** `favoritos` (lista), `loading`, `error`.
- **Computed:** `favoritosIds` (`Set` de `producto_id`).
- **Acciones:** `fetchFavoritos`, `agregar`, `quitar`, `toggle` (devuelve
  `{success, error?}`), `esFavorito(productoId)`, `clearFavoritos` (al logout).
  `CatalogView` hace actualización optimista y revierte si `toggle` falla.

### `notificacionStore.js` (`useNotificacionStore`, id `notificacion`)

- **Estado:** `notificaciones` (máx. 50 del backend), `noLeidas`, `loading`.
- **Acciones:** `fetchNotificaciones`, `marcarLeida(id)`, `marcarTodasLeidas()`.
- `App.vue` la monta con polling cada 30 s (solo con sesión) y muestra la campana
  con badge; al hacer clic navega al pedido o producto según `datos`.

## Diseño y paleta de colores

Variables en `src/assets/estilos/paleta.css` (usar **solo** estas; prohibidos
colores hardcodeados y emojis —ver `.agents/skills/convenciones-vue/SKILL.md`):

```css
--kei-gris-oscuro: #4D4D59;  /* botones secundarios, badges */
--kei-gris-medio: #565659;   /* texto secundario */
--kei-casi-negro: #3A3E40;   /* títulos, texto, CTA oscuro */
--kei-gris-claro: #D9D9D7;   /* bordes */
--kei-beige: #737166;        /* acento beige */
--kei-beige-medio: #8C8A80;
--kei-beige-claro: #A6A498;
--kei-fondo: #F2F2F2;        /* fondo global */
--kei-negro: #0D0D0D;
--kei-oliva: #8CB07A;        /* primario: btn-primary, links activos */
--kei-oliva-claro: #C1D1B4;
--kei-oliva-oscuro: #6E8A5A;
--kei-oliva-suave: #EAF0E2;  /* fondos suaves (hero, bloques) */
--kei-rojo: #C0392B;         /* favoritos */
```

Mapeo Bootstrap: `btn-primary/bg-primary/text-primary` → oliva;
`btn-secondary` → gris oscuro; `navbar` blanca con borde oliva claro;
`footer` (`footer-kei`) casi negro con borde superior oliva. Tipografías:
Playfair Display (titulares, `.font-display`) + Inter (cuerpo).

Verificación obligatoria tras cambios visuales:

```bash
npm run build
grep -rP "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" src/   # debe dar 0 (sin emojis)
grep -rn "#[0-9a-fA-F]" src/  # solo paleta.css y #fff en superficies (coherente con paleta)
```

## Ejecución, despliegue y ngrok

### Qué página abrir

- **Local:** `http://localhost:5173` → redirige solo a `/catalogo` (la tienda).
  Landing informativa: `http://localhost:5173/sobre-nosotros`.
- **Construido (`dist/`):** servir la carpeta con cualquier estático + fallback
  SPA a `index.html` (ver `nginx.conf`).

### Desarrollo / preview / producción

```bash
npm run dev      # desarrollo en http://localhost:5173 (hot reload)
npm run build    # genera dist/ (verificación obligatoria antes de mergear)
npm run preview  # sirve el build local para probar producción
# Docker (producción): docker build -t keibeauty-frontend . && docker run -p 80:80 keibeauty-frontend
```

### Probar desde el teléfono con ngrok

ngrok expone tu PC a internet con una URL pública (cambia en cada arranque salvo
dominio reservado). Pasos:

```bash
# 1. Instalar ngrok y autenticar (una sola vez)
ngrok config add-authtoken <tu-authtoken>

# 2. Exponer frontend y backend (dos terminales)
ngrok http 5173
ngrok http 5000
# Anotar ambas URLs, ej:
# frontend: https://abcd1234.ngrok-free.app
# backend:  https://efgh5678.ngrok-free.app
```

3. El backend ya acepta orígenes ngrok (`CORS_ORIGINS_REGEX_EXTRA`, ver README
   del backend). Si recreaste la BD o el `.env`, recordar esa variable.
4. En el teléfono, abrir **una sola vez** (modo transparente):
   `https://abcd1234.ngrok-free.app/config-api?api=https://efgh5678.ngrok-free.app/api`
   La vista guarda la dirección, muestra confirmación y tiene botón
   **Probar conexión** (consulta `/health`). Desde ahí todo funciona:
   catálogo, login, carrito, checkout.
5. Cada vez que ngrok dé URLs nuevas, repetir solo el paso 4 con las nuevas.
6. Alternativa manual: abrir `/config-api`, pegar la URL y **Guardar** (o
   **Volver al valor por defecto** para localhost).

> Notas: en `vite.config.js` el dev server usa `host: true` y `allowedHosts`
> para aceptar el dominio ngrok. `VITE_API_URL` solo aplica cuando NO hay
> override guardado (el override de `/config-api` tiene prioridad).

## GitFlow

Igual que el backend: `main` (producción) · `develop` (integración) ·
`feature/*` · `hotfix/*`. Rama desde `develop`, commits simples en español,
merge con `--no-ff`, push de rama y `develop`, **no borrar** ramas. Prohibido:
rebase, force push, tocar `main`, borrar tags. En Windows: `git config core.autocrlf true`.

## Troubleshooting

| Problema | Causa probable / solución |
|---|---|
| `vite: not found` | Falta `npm install`. |
| Pantalla en blanco + error CORS en consola | Backend apagado o `CORS_ORIGINS` sin `http://localhost:5173`; revisar `VITE_API_URL`. |
| `401` en loop / sesión que no persiste | `localStorage` con tokens viejos: cerrar sesión y reingresar; revisar expiración JWT (24 h). |
| Redirige a `/verificar-2fa` sin haber pedido código | Quedó `temp_token` en `localStorage`: cancelar el login o limpiar almacenamiento. |
| Imágenes rotas (letra inicial en vez de foto) | `imagen_url` externa caída o ImageKit sin configurar en backend; el fallback muestra la inicial. |
| `npm run build` falla | Revisar imports (rutas `../stores/...`), sintaxis Vue y variables `VITE_*` usadas. |
| Nginx muestra 404 al recargar `/catalogo` | Falta `try_files $uri $uri/ /index.html;` en `nginx.conf` (ya incluido). |
| Carrito vacío tras login | Normal si el carrito era de invitado en otro navegador: el `guest_token` vive en `localStorage` local. |

