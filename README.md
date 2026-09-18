# KeiBeauty Frontend

Interfaz del e-commerce **KeiBeauty** (nombre comercial en redes: **Kei Esencia**),
empresa guatemalteca de K-Beauty fundada en 2021 en Quetzaltenango. SPA donde los
clientes exploran el catálogo con filtros y orden por precio, gestionan carrito y
favoritos, compran como invitados o registrados, siguen sus pedidos y reciben
notificaciones; incluye panel administrativo (productos, marcas, categorías,
pedidos con guía, reseñas y reportes con Excel) y página `/config-api` para
apuntar al backend sin recompilar.

Proyecto de Seminario de Sistemas 1 — USAC-CUNOC. Fase 2.

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Vue 3 | ^3.4.0 | Composition API con `<script setup>` |
| Vite | ^5.0.0 | Dev server y build (puerto 5173) |
| Vue Router | ^4.3.0 | SPA + guards auth/2FA/guest |
| Pinia | ^2.1.0 | Estado global (auth, carrito, favoritos, notificaciones) |
| Axios | ^1.6.0 | HTTP con interceptores JWT/guest |
| Bootstrap | ^5.3.8 | Framework CSS |
| Bootstrap Icons | ^1.13.1 | Iconos vectoriales (sin emojis en la UI) |
| vue-toastification | ^2.0.0-rc.5 | Toasts en español |
| Docker + Nginx | — | Producción multi-etapa (`nginx.conf` con fallback SPA) |

## Requisitos previos

- Node.js 18+ y npm
- Docker (opcional, producción)
- Backend en `http://localhost:5000` (ver README del backend)
- Git

> **Windows/WSL:** `git config core.autocrlf true`. Se recomienda WSL2.

## Instalación en local

```bash
git clone git@github.com:Jbrod5/KeiBeauty-frontend.git KeiBeauty-frontend
cd KeiBeauty-frontend

cp .env.example .env
# Revisar VITE_API_URL (defecto http://localhost:5000/api)

npm install
npm run dev     # http://localhost:5173
npm run build   # dist/ (verificación obligatoria antes de mergear)
npm run preview # sirve el build local
```

## Variables de entorno

| Variable | Obligatoria | Descripción | Ejemplo |
|---|---|---|---|
| `VITE_API_URL` | Sí | URL base de la API (sin `/` final) | `http://localhost:5000/api` |
| `VITE_WHATSAPP_URL` | No | Contacto WhatsApp | `https://wa.me/50239718418?text=Hola...` |

`VITE_*` se inyecta al compilar; aplica cuando NO hay override de `/config-api`.

## Estructura del proyecto

```
KeiBeauty-frontend/
├── index.html               # Entry HTML (favicon /kei-beauty.jpg)
├── package.json             # Dependencias y scripts (dev/build/preview)
├── vite.config.js           # Vite 5173 + allowedHosts (localhost, ngrok)
├── .env.example             # VITE_API_URL, VITE_WHATSAPP_URL
├── Dockerfile               # node build → nginx production
├── nginx.conf               # try_files ... /index.html
├── public/kei-beauty.jpg    # Logo (favicon URL estable)
└── src/
    ├── main.js              # App + Pinia + Router + Toast + paleta + initAuth
    ├── App.vue              # Navbar (logo, catálogo, sobre nosotros, carrito,
    │                        # campana, avatar) + footer + WhatsApp flotante
    ├── assets/estilos/paleta.css  # Variables --kei-* + overrides Bootstrap
    ├── assets/kei-beauty.jpg      # Logo importado en el navbar
    ├── router/index.js      # Rutas, redirect / → /catalogo, guards
    ├── services/api.js      # Axios + ~40 funciones + URL dinámica
    ├── stores/              # authStore, cartStore, favoritosStore, notificacionStore
    ├── views/               # 24 vistas (ver tabla de rutas)
    └── components/          # Vacío: la UI vive en vistas
```

## Rutas de la aplicación

`/` redirige a `/catalogo`. Landing en `/sobre-nosotros`.

| Ruta | Componente | Auth | Admin | Descripción |
|---|---|---|---|---|
| `/` | — | No | — | Redirect → `/catalogo` |
| `/sobre-nosotros` | `HomeView.vue` | No | — | Landing (empresa, marcas, skincare/haircare) |
| `/config-api` | `ConfigApiView.vue` | No | — | Fija la URL del backend (`?api=<url>`) + probar conexión |
| `/catalogo` | `CatalogView.vue` | No | — | Búsqueda (debounce), filtros categoría/marca, orden por precio, favoritos |
| `/catalogo?marca=<id>` | `CatalogView.vue` | No | — | Prefiltrado (enlace "Ver más de esta marca" del detalle) |
| `/producto/:id` | `ProductDetailView.vue` | No | — | Galería, stock, reseñas, alerta "avísame", enlace a marca |
| `/carrito` | `CartView.vue` | No | — | Carrito invitado + autenticado |
| `/checkout` | `CheckoutView.vue` | No | — | Checkout autenticado o invitado |
| `/login` | `LoginView.vue` | Invitado | — | Login (deriva a 2FA si aplica) |
| `/registro` | `RegisterView.vue` | Invitado | — | Registro de cliente |
| `/olvide-contrasena` | `ForgotPasswordView.vue` | Invitado | — | Solicita email de recuperación |
| `/reestablecer-contrasena` | `ResetPasswordView.vue` | Invitado | — | Nueva contraseña con token |
| `/verificar-2fa` | `TwoFactorView.vue` | Flujo 2FA | — | Código de 6 dígitos |
| `/perfil` | `ProfileView.vue` | Sí | — | Datos + activar/desactivar 2FA |
| `/perfil/favoritos` | `FavoritosView.vue` | Sí | — | Favoritos |
| `/mis-pedidos` | `OrderHistoryView.vue` | Sí | — | Historial |
| `/mis-pedidos/:id` | `OrderDetailView.vue` | Sí | — | Detalle propio |
| `/admin` | `AdminDashboardView.vue` | Sí | Sí* | Dashboard |
| `/admin/productos` | `AdminProductsView.vue` | Sí | Sí* | CRUD + inventario |
| `/admin/productos/crear` | `AdminProductoCrearView.vue` | Sí | Sí* | Crear (multipart) |
| `/admin/productos/:id/editar` | `AdminProductoEditarView.vue` | Sí | Sí* | Editar + galería |
| `/admin/marcas` | `AdminMarcasView.vue` | Sí | Sí* | CRUD marcas |
| `/admin/categorias` | `AdminCategoriesView.vue` | Sí | Sí* | CRUD categorías |
| `/admin/pedidos` | `AdminOrdersView.vue` | Sí | Sí* | Estados + guía |
| `/admin/pedidos/:id` | `OrderDetailView.vue` | Sí | Sí* | Detalle con acciones admin |
| `/admin/resenas` | `AdminResenasView.vue` | Sí | Sí* | Gestión de reseñas |
| `/admin/reportes` | `AdminReportesView.vue` | Sí | Sí* | Reportes + Excel |

\* El guard exige autenticación; el rol `admin` lo verifica cada vista al
montarse. Rutas `guest` redirigen a `/catalogo` con sesión. Con flujo 2FA
activo todo redirige a `/verificar-2fa`.

## Consumo de la API

**URL dinámica (sin recompilar):** cada petición resuelve su base con
`obtenerUrlBaseApi()` (`src/services/api.js`): `localStorage.api_base_url`
(fijada en `/config-api`) > `VITE_API_URL` > defecto local. Helpers:
`guardarUrlBaseApi`, `restablecerUrlBaseApi`, `hayOverrideUrlBaseApi`. Con
`ngrok` en la URL se agrega `ngrok-skip-browser-warning: 1`.

El interceptor adjunta `Authorization: Bearer <access_token>` (o `temp_token`
en endpoints 2FA) y `X-Guest-Token` para carrito invitado.

### Autenticación

| Función | Endpoint | Envía | Recibe | Usada desde |
|---|---|---|---|---|
| `login(c)` | `POST /auth/login` | `{email, password}` | `{mensaje, usuario, access_token, refresh_token}` o `{data: {requiere_2fa, email, token_temporal}}` | `authStore`, `LoginView` |
| `register(d)` | `POST /auth/registro` | `{nombre, email, password, telefono?, direccion_envio}` | tokens + usuario (`201`) | `authStore`, `RegisterView` |
| `getProfile()` | `GET /auth/perfil` | JWT | `{usuario}` | `authStore.initAuth` |
| `refreshToken(t)` | `POST /auth/refresh` | JWT-refresh | `{access_token}` | `authStore` |
| `forgotPassword(e)` | `POST /auth/olvide-contrasena` | `{email}` | `{data: null, message}` | `ForgotPasswordView` |
| `resetPassword(t,p,c)` | `POST /auth/reestablecer-contrasena` | `{token, password, confirm_password}` | `{data: null, message}` | `ResetPasswordView` |
| `verify2FA(e,c,t)` | `POST /auth/verificar-2fa` | `{codigo}` (temp JWT) | tokens + usuario | `authStore`, `TwoFactorView` |
| `resend2FA(e,t)` | `POST /auth/reenviar-codigo-2fa` | temp JWT | `{data: null, message}` | `authStore` |
| `cancelarLogin(t)` | `POST /auth/cancelar-login` | temp JWT | `{message}` | `authStore` |
| `activar2FA()/desactivar2FA()` | `POST /auth/activar-2fa`, `/desactivar-2fa` | JWT | `{data: {two_factor_enabled}}` | `ProfileView` |

### Catálogo, carrito, pedidos y admin

| Función | Endpoint | Envía | Recibe | Usada desde |
|---|---|---|---|---|
| `getProducts(p)` | `GET /products?categoria&marca&buscar&con_favorito` | query | `{data: [<producto>]}` | `CatalogView` |
| `getProductById(id)` | `GET /products/<id>` | — | `{data: <producto>}` | `ProductDetailView` |
| `getMarcas()/getCategories()` | `GET /products/marcas`, `/categorias` | — | `{data}` | filtros `CatalogView` |
| `createProduct/updateProduct/deleteProduct` | `POST/PUT/DELETE /products` | JSON o `FormData` (admin) | `{data}` | vistas admin |
| `uploadProductImage/getProductoImagenes/subirImagenesGaleria/marcarImagenPrincipal/eliminarImagenGaleria` | `/products/<id>/imagen…` | `FormData` (admin) | `{data}` | edición admin, detalle |
| `ajustarInventario(id,t,c)` | `POST /products/<id>/inventario` | `{tipo, cantidad, costo_unitario?}` (admin) | `{data}` | `AdminProductsView` |
| `getCart/addToCart/updateCartItem/removeCartItem/clearCart` | `/carrito…` | `{producto_id, cantidad}` / `{cantidad}` | `{data: <carrito>}` | `cartStore`, `CartView` |
| `createOrder(d)` | `POST /pedidos` | `{direccion_envio}` (+ contacto/ítems si invitado) | `{data: <pedido>}` (`201`) | `CheckoutView` |
| `getOrders/getOrderById/updateOrderStatus/uploadGuia` | `/pedidos…` | `{estado}` / `FormData{archivo}` | `{data}` | historial, detalle, admin |
| `getFavoritos/agregarFavorito/quitarFavorito` | `/favoritos…` | JWT | `{data}` | `favoritosStore` |
| `getResenas/createResena/updateResena/deleteResena` | `/resenas…` | `{producto_id, calificacion 1-5, comentario?}` | `{data, promedio, total}` | detalle, admin |
| `createCategory/updateCategory/deleteCategory` | `/categorias…` | `{nombre, descripcion?}` (admin) | `{data}` | `AdminCategoriesView` |
| `createMarca/updateMarca/deleteMarca` | `/marcas…` | JSON o `FormData` (admin) | `{data}` | `AdminMarcasView` |
| `getAlertaProducto/crearAlertaProducto/eliminarAlertaProducto` | `/notificaciones/producto/<id>/alerta` | JWT | `{data}` | detalle ("Avísame") |
| `getReportes*` (6) + `descargarExcel` | `/reportes/*?desde&hasta&limit(&excel=1)` | query (admin) | `{data}` o `.xlsx` | `AdminReportesView` |

Notificaciones in-app (`GET /notificaciones`, `PUT .../leida`, `PUT /leer-todas`)
se consumen directo con `api` desde `notificacionStore.js` (campana en `App.vue`,
polling 30 s con sesión).

## Stores de Pinia

- **`authStore`** (`auth`): `user`, tokens en `localStorage`, `loading/error`;
  `isAuthenticated`, `isAdmin`, `isIn2FAFlow`; `login` (deriva a 2FA),
  `register`, `verify2FA/resend2FA/cancelLogin`, `activar/desactivar2FA`,
  `fetchProfile` (reintenta con refresh; limpia sesión ante 401/422),
  `logout`, `initAuth`.
- **`cartStore`** (`cart`): `items`, `guestToken` persistido; `totalItems`,
  `totalPrice`; `fetchCart/addItem/updateQuantity/removeItem/clearCartItems`
  con reversión optimista.
- **`favoritosStore`** (`favoritos`): lista + `favoritosIds` (Set);
  `fetch/agregar/quitar/toggle/esFavorito/clearFavoritos`.
- **`notificacionStore`** (`notificacion`): últimas 50 + `noLeidas`;
  `fetchNotificaciones/marcarLeida/marcarTodasLeidas`.

## Diseño y paleta

Variables en `src/assets/estilos/paleta.css` (única fuente de color):

```css
--kei-gris-oscuro: #4D4D59; --kei-gris-medio: #565659; --kei-casi-negro: #3A3E40;
--kei-gris-claro: #D9D9D7; --kei-beige: #737166; --kei-beige-medio: #8C8A80;
--kei-beige-claro: #A6A498; --kei-fondo: #F2F2F2; --kei-negro: #0D0D0D;
--kei-oliva: #8CB07A; --kei-oliva-claro: #C1D1B4; --kei-oliva-oscuro: #6E8A5A;
--kei-oliva-suave: #EAF0E2; --kei-rojo: #C0392B;
```

`btn-primary` → oliva; `btn-secondary` → gris oscuro; navbar blanca con borde
oliva; footer casi negro. Tipografías: Playfair Display (titulares) + Inter
(cuerpo). Iconos: Bootstrap Icons; la UI no usa emojis. Tras cambios visuales:
`npm run build` + `grep -rP "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" src/`
(solo coincide el binario del logo).

## GitFlow

`main` · `develop` · `feature/*` · `hotfix/*`. Rama desde `develop`, commits en
español, merge `--no-ff`, push de rama y `develop`, sin borrar ramas. Prohibido:
rebase, force push, `main`, borrar tags. Windows: `git config core.autocrlf true`.

## Despliegue

### Qué página abrir

- **Local:** `http://localhost:5173` → redirige a `/catalogo`. Landing:
  `/sobre-nosotros`. Config API: `/config-api`.
- El backend solo expone JSON en local (`http://localhost:5000`,
  `/health` para verificar).

### Despliegue del frontend a través del backend (modo actual)

Por ahora la tienda se sirve desde la API, en una sola URL:

- **Ruta:** `/` y cualquier ruta SPA (`/catalogo`, `/sobre-nosotros`,
  `/config-api`, ...) devuelven el build; `/health` y `/api/*` siguen JSON.
- **Por qué así:** una sola URL para probar en teléfono con ngrok (un solo
  túnel en vez de dos), mismo origen entre tienda y API (sin CORS) y un solo
  servicio en ejecución.
- **Cómo:** `npm run build` aquí + `STATIC_DIR=/frontend-dist` en el `.env` del
  backend (su `docker-compose.yml` monta `../KeiBeauty-frontend/dist`) +
  `docker compose up -d api` allá.

### Producción independiente (Docker + Nginx)

`docker build -t keibeauty-frontend . && docker run -p 80:80 keibeauty-frontend`
(`nginx.conf` con fallback SPA). `VITE_API_URL` se fija al compilar.

### Probar desde el teléfono con ngrok

**Opción A (actual): una sola URL** con el modo anterior:

```bash
npm run build
# en el backend: ngrok http 5000
# Tienda:  https://<url>/
# Config:  https://<url>/config-api?api=https://<url>/api
```

**Opción B: dos túneles** (dev + API por separado): `ngrok http 5173` y
`ngrok http 5000`; el backend acepta orígenes ngrok
(`CORS_ORIGINS_REGEX_EXTRA`); en el teléfono abrir
`https://<front>/config-api?api=https://<back>/api`. El dev server acepta hosts
ngrok (`allowedHosts` en `vite.config.js`). Con URL nueva de ngrok se repite
solo el paso de `/config-api`.

Autenticar ngrok una sola vez: `ngrok config add-authtoken <tu-authtoken>`.

## Testing y CI

`package.json` define `dev`, `build` y `preview`; el repositorio no incluye
suite de tests ni workflows de CI (no existe `.github/`). La verificación es
`npm run build` sin errores más pruebas manuales del flujo en navegador.

## Troubleshooting

| Problema | Solución |
|---|---|
| `vite: not found` | `npm install` |
| Pantalla en blanco + CORS | Backend apagado o sin origen en `CORS_ORIGINS`; revisar `VITE_API_URL` |
| 401/422 en loop | `localStorage` con token viejo: la app lo limpia sola; si persiste, limpiar storage y reingresar |
| Redirige a `/verificar-2fa` | Quedó `temp_token`: cancelar login o limpiar storage |
| Imágenes rotas (inicial) | `imagen_url` caída o ImageKit sin configurar en backend |
| Cambio de `VITE_*` sin efecto | El override de `/config-api` tiene prioridad; restablecerlo |
| 404 al recargar ruta en Nginx | `try_files ... /index.html` (ya en `nginx.conf`) |
| Carrito vacío tras login | El `guest_token` es por navegador (`localStorage`) |
