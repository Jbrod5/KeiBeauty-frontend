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
| Chart.js + vue-chartjs | ^4.5.1 / ^5.3.4 | Gráficos del panel de reportes |
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
    ├── App.vue              # Navbar (marca, catálogo, buscador centrado, campana,
    │                        # carrito, avatar) + footer + WhatsApp flotante
    ├── components/         # NotificacionesLista (campana y menú del perfil)
    ├── composables/         # useEnvio (política de envío compartida)
    ├── assets/estilos/paleta.css  # Variables --kei-* + overrides Bootstrap
    ├── assets/kei-beauty.jpg      # Logo importado en el navbar
    ├── router/index.js      # Rutas, redirect / → /catalogo, guards
    ├── services/api.js      # Axios + ~40 funciones + URL dinámica
    ├── stores/              # authStore, cartStore, favoritosStore, notificacionStore
    └── views/               # 25 vistas (ver tabla de rutas)
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
| `/admin/pedidos/:id` | `OrderDetailView.vue` | Sí | Sí* | Detalle con cambio de estado y subida de guía |
| `/admin/resenas` | `AdminResenasView.vue` | Sí | Sí* | Gestión de reseñas |
| `/admin/reportes` | `AdminReportesView.vue` | Sí | Sí* | Reportes + Excel |
| `/admin/configuracion` | `AdminConfiguracionView.vue` | Sí | Sí* | Costo de envío y envío gratis |

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
| `verificarCodigoRecuperacion(e,c)` | `POST /auth/verificar-codigo-recuperacion` | `{email, codigo}` | `{data: {token, email, nombre}, message}` | `ForgotPasswordView` |
| `reenviarCodigoRecuperacion(e)` | `POST /auth/reenviar-codigo-recuperacion` | `{email}` | `{data: null, message}` | `ForgotPasswordView` |
| `resetPassword(t,p,c)` | `POST /auth/reestablecer-contrasena` | `{token, password, confirm_password}` | `{data: null, message}` | `ForgotPasswordView` (paso 3), `ResetPasswordView` (enlaces antiguos) |
| `verify2FA(e,c,t)` | `POST /auth/verificar-2fa` | `{codigo}` (temp JWT) | tokens + usuario | `authStore`, `TwoFactorView` |
| `resend2FA(e,t)` | `POST /auth/reenviar-codigo-2fa` | temp JWT | `{data: null, message}` | `authStore` |
| `cancelarLogin(t)` | `POST /auth/cancelar-login` | temp JWT | `{message}` | `authStore` |
| `activar2FA()/desactivar2FA()` | `POST /auth/activar-2fa`, `/desactivar-2fa` | JWT | `{data: {two_factor_enabled, usuario}}` | `ProfileView` |

**Recuperación de contraseña:** `/olvide-contrasena` es un asistente de 3 pasos
(email → código de 6 dígitos → nueva contraseña) en `ForgotPasswordView`. El
código expira a los 15 minutos y se puede reenviar cada 60 segundos.

**Cierre de sesión:** `authStore.logout()` deja un aviso en `logoutNotice`
(`{tipo, mensaje}`) que `App.vue` muestra como toast. Si la sesión expiró por
token vencido, el aviso es informativo en vez de "sesión cerrada".

### Gráficos y exportaciones a Excel

El panel de reportes (`/admin/reportes`) incluye una sección **Gráficos** con
cinco visualizaciones que respetan el rango de fechas del filtro global:

1. Ventas por mes (barras) — `/api/reportes/ventas-por-mes`
2. Ganancias por mes (línea, ingresos vs. costos) — `/api/reportes/ganancias`
   (usa la serie `por_mes` que devuelve el endpoint)
3. Productos más vendidos (barras horizontales) — `/api/reportes/productos-mas-vendidos`
4. Clientes con más compras (barras) — `/api/reportes/clientes-top`
5. Ventas con descuento (barras) — `/api/reportes/ventas-con-descuento`

Las librerías `chart.js` y `vue-chartjs` están en `package.json` y
`package-lock.json` (sin CDN: el build es autónomo).

Las descargas a Excel incluyen siempre el periodo cubierto en un subtítulo y
el nombre del archivo lleva las fechas del filtro.

### Descuentos por producto

Un producto puede tener descuentos con porcentaje y rango de fechas. Solo
aplica el descuento **vigente** (`activo` y dentro de las fechas); si dos se
solapan gana el de mayor porcentaje.

- El backend expone en cada producto `precio_descuento` (precio final),
  `tiene_descuento` y `porcentaje_descuento`; `precio` sigue siendo el precio
  de catálogo.
- `CatalogView` y `ProductDetailView` muestran el precio tachado junto al
  precio con descuento; `CartView` muestra el precio original tachado en el
  ítem.
- La gestión de descuentos (crear, activar/desactivar, editar y eliminar) está
  en la sección "Descuentos" de `AdminProductoEditarView`.
- `AdminReportesView` incluye la tarjeta "Ventas con Descuento" con las
  unidades, ingresos, ahorro dado y la variación frente al periodo anterior.

### Costo de envío y envío gratis

El envío es un costo fijo (`costo_envio`) que se descuenta del total del
pedido, salvo que el subtotal alcance `minimo_envio_gratis`, en cuyo caso el
envío es gratis. Ambos valores se editan en `/admin/configuracion`
(`AdminConfiguracionView.vue`), que además tiene el interruptor
**"Envío gratis por monto mínimo"**: apagado, el envío se cobra siempre y el
cliente no ve ni el contador ni el aviso de envío gratis.

El cálculo vive en el composable `src/composables/useEnvio.js`, que consume
tanto `CartView` como `CheckoutView`: por eso **el carrito y el checkout
muestran siempre el mismo desglose** (Subtotal / Envío / Total, el badge
"Gratis" cuando corresponde y el aviso de cuánto falta para el envío gratis).
`OrderDetailView` muestra `subtotal_productos`, `costo_envio` y `monto_total`
del pedido.

### Barra superior y filtros del catálogo

- La barra superior usa una cuadrícula de tres columnas: **marca** (con el
  enlace al catálogo), **buscador centrado** e **iconos a la derecha**
  (notificaciones, carrito y perfil). No hay menú de hamburguesa: la barra
  siempre está visible.
- El **buscador** escribe la búsqueda en la URL (`/catalogo?buscar=...`). El
  catálogo la aplica al instante, también si ya se está en esa página. En
  móvil se oculta y se despliega con el botón de lupa, que ocupa el espacio
  entre la marca y los iconos; la marca se muestra en dos líneas (Kei /
  Beauty).
- El carrito solo se muestra a clientes e invitados (los administradores no
  compran). La campana de notificaciones está siempre en la barra de
  escritorio y, en móvil, dentro del menú del perfil.
- El menú del administrador quedó reducido a *Mi perfil*, *Panel de
  administración* y *Cerrar sesión*; el resto de secciones se organizan por
  grupos en `/admin`.
- En el catálogo, los filtros (**ordenar por precio**, **marca** y
  **categoría**) están en una mini barra bajo la barra principal, con botones
  que abren un desplegable con las opciones. El grid de productos ocupa todo
  el ancho: **4 por fila en escritorio, 3 en tablet y 2 en móvil**.

### Direcciones y teléfonos guardados

Una cuenta puede tener varias direcciones de envío y varios teléfonos. El
cliente los gestiona en `ProfileView` (secciones "Mis direcciones" y "Mis
teléfonos": agregar, editar, eliminar y marcar principal) y los elige en el
`CheckoutView` con un selector. Si escribe una dirección o teléfono nuevo
puede marcar "Guardar en mi cuenta"; el backend guarda el snapshot en el
pedido (`direccion_envio`, `telefono_contacto`, `telefono_2`).

Solo puede haber una principal de cada tipo: al cambiarla se actualizan
`usuarios.direccion_envio` y `usuarios.telefono`, y `GET /auth/perfil` devuelve
las listas `direcciones` y `telefonos`.

### Catálogo, carrito, pedidos y admin

| Función | Endpoint | Envía | Recibe | Usada desde |
|---|---|---|---|---|
| `getProducts(p)` | `GET /products?categoria&marca&buscar&con_favorito` | query | `{data: [<producto>]}` | `CatalogView` |
| `getProductById(id)` | `GET /products/<id>` | — | `{data: <producto>}` | `ProductDetailView` |
| `getMarcas()/getCategories()` | `GET /products/marcas`, `/categorias` | — | `{data}` | filtros `CatalogView` |
| `createProduct/updateProduct/deleteProduct` | `POST/PUT/DELETE /products` | JSON o `FormData` (admin) | `{data}` | vistas admin (crear acepta marca/categoría nueva como texto) |
| `uploadProductImage/getProductoImagenes/subirImagenesGaleria/marcarImagenPrincipal/eliminarImagenGaleria` | `/products/<id>/imagen…` | `FormData` (admin) | `{data}` | edición admin, detalle |
| `ajustarInventario(id,t,c)` | `POST /products/<id>/inventario` | `{tipo, cantidad, costo_unitario?}` (admin) | `{data}` | `AdminProductsView` |
| `getCart/addToCart/updateCartItem/removeCartItem/clearCart` | `/carrito…` | `{producto_id, cantidad}` / `{cantidad}` | `{data: <carrito>}` | `cartStore`, `CartView` |
| `createOrder(d)` | `POST /pedidos` | cliente: `{direccion_id}` o `{direccion_envio, guardar_direccion?}`, `{telefono_id}` o `{telefono, guardar_telefono?}`, `{telefono_2?}`; invitado: `{direccion_envio, email_contacto, telefono_contacto, items?}` | `{data: <pedido>}` (`201`) | `CheckoutView` |
| `getOrders/getOrderById/updateOrderStatus/uploadGuia` | `/pedidos…` | `{estado}` / `FormData{archivo}` | `{data}` | historial, detalle (admin: estado + guía), AdminOrdersView |
| `getFavoritos/agregarFavorito/quitarFavorito` | `/favoritos…` | JWT | `{data}` | `favoritosStore` |
| `getResenas/createResena/updateResena/deleteResena` | `/resenas…` | `{producto_id, calificacion 1-5, comentario?}` | `{data, promedio, total}` | detalle, admin |
| `createCategory/updateCategory/deleteCategory` | `/categorias…` | `{nombre, descripcion?}` (admin) | `{data}` | `AdminCategoriesView` |
| `createMarca/updateMarca/deleteMarca` | `/marcas…` | JSON o `FormData` (admin) | `{data}` | `AdminMarcasView` |
| `getAlertaProducto/crearAlertaProducto/eliminarAlertaProducto` | `/notificaciones/producto/<id>/alerta` | JWT | `{data}` | detalle ("Avísame") |
| `getDirecciones/crearDireccion/actualizarDireccion/eliminarDireccion` | `/usuario/direcciones…` | JWT · `{alias?, direccion, es_principal?}` | `{data: [<direccion>]}` | `ProfileView`, `CheckoutView` |
| `getTelefonos/crearTelefono/actualizarTelefono/eliminarTelefono` | `/usuario/telefonos…` | JWT · `{telefono, es_principal?}` | `{data: [<telefono>]}` | `ProfileView`, `CheckoutView` |
| `getReportes*` (6) + `descargarExcel` | `/reportes/*?desde&hasta&limit(&excel=1)` | query (admin) | `{data}` o `.xlsx` | `AdminReportesView` |
| `getConfiguracion/actualizarConfiguracion` | `/configuracion` | JWT-Admin · `{clave, valor}` | `{data}` | `AdminConfiguracionView` |
| `getConfiguracionEnvio` | `GET /configuracion/envio` | — (público) | `{data: {costo_envio, minimo_envio_gratis}}` | `CheckoutView` |
| `getDescuentosProducto/crearDescuento/actualizarDescuento/cambiarEstadoDescuento/eliminarDescuento` | `/products/<id>/descuentos…` | JWT-Admin · `{porcentaje, fecha_inicio, fecha_fin}` | `{data}` | `AdminProductoEditarView` |
| `getReportesVentasConDescuento` | `/reportes/ventas-con-descuento?desde&hasta` | query (admin) | `{data: {productos, totales, comparacion}}` | `AdminReportesView` |

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


## GitFlow

Ramas:
- `main` (producción) — se despliega automáticamente a AWS con cada push.
- `develop` (integración) — aquí se mergesan todas las ramas `feature/*`.
- `feature/*` (introducción de funcionalidad).
- `hotfix/*` (arreglo rápido de un error).

**Flujo de trabajo:**

```text
feature/mi-tarea  ──merge --no-ff──▶  develop  ──merge --no-ff──▶  main
                                                       │
                                                       └──▶ GitHub Actions
                                                            despliega a AWS
```

- Nadie trabaja directamente sobre `main` ni sobre `develop`.
- Cada tarea vive en su rama `feature/*` creada desde `develop`.
- Al integrar en `develop` se usa `git merge --no-ff` para que quede el
  registro de la rama.
- `main` se actualiza cuando el trabajo está listo para producción; ese push
  dispara el pipeline de despliegue.

## Despliegue

### Qué página abrir

- **Local:** `http://localhost:5173` → redirige a `/catalogo`. Landing:
  `/sobre-nosotros`. Config API: `/config-api`.
- El backend solo expone JSON en local (`http://localhost:5000`,
  `/health` para verificar).

### AWS (modo actual)

El frontend se desplega como sitio estático en **S3 + CloudFront**:

| Componente | Servicio | Notas |
|---|---|---|
| Archivos estáticos | **S3** | Bucket con el contenido de `dist/`. `index.html` nunca se cachea. |
| CDN + HTTPS | **CloudFront** | Certificado por defecto, sin coste adicional. |
| API | **EC2 + RDS** (otro repo) | El frontend llama a la API por `VITE_API_URL`. |

El despliegue lo hace **GitHub Actions** (`.github/workflows/deploy.yml`) en
cada push a `main`:

1. `npm ci` → `npm run build` (con `VITE_API_URL` desde los secretos).
2. `aws s3 sync dist/ s3://<bucket> --delete` — los assets con hash en el
   nombre se cachean un año (`immutable`); `index.html` se sube aparte con
   `no-cache` para que siempre tome los hashes nuevos.
3. `aws cloudfront create-invalidation --paths "/*"` para purgar la caché.

**Secretos requeridos** (Settings → Secrets and variables → Actions):

| Secret | Descripción |
|---|---|
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Credenciales de AWS |
| `S3_BUCKET` | Nombre del bucket |
| `CLOUDFRONT_DISTRIBUTION_ID` | Id de la distribución |
| `VITE_API_URL` | URL pública de la API (ej. `https://api.ejemplo.com/api`) |

> `dist/` **no** se versiona: está en `.gitignore` y el pipeline genera el
> build en cada despliegue.

### Despliegue del frontend a través del backend (modo anterior)

La tienda también se puede servir desde la API, en una sola URL:

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


## Solucion a posibles errores

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

## Reconstruir imágenes Docker

Si modificaste dependencias (`package.json`), el `Dockerfile`, el
`nginx.conf` o el `docker-compose.yml` (si aplica), tenés que reconstruir la
imagen. La diferencia clave: reconstruir **todo** es más lento pero garantiza
que no queden capas viejas en caché; reconstruir **solo el frontend** es más
rápido y no toca el backend ni la BD.

> Si usas el modo actual (frontend servido por el backend vía
> `STATIC_DIR`), después de reconstruir hay que correr `npm run build` de
> nuevo para regenerar `dist/` y levantar el `api` del backend.

### Reconstruir el frontend

```bash
cd KeiBeauty-frontend
docker build -t keibeauty-frontend .
docker run -d -p 80:80 keibeauty-frontend
```

### Con docker-compose (si aplica)

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

> `docker compose down -v` (con `-v`) **borra los volúmenes**, es decir,
> puede **borrar la base de datos** si la BD vive en un volumen del mismo
> compose. Sin `-v` los datos se conservan. Verificá qué volúmenes existen con
> `docker volume ls` antes de usar `-v`.

### Verificar

```bash
docker ps
docker logs <container_id>
```

Abrir `http://localhost` (Nginx en el puerto 80) y comprobar que redirige a
`/catalogo`. Si ves pantalla en blanco, revisá `VITE_API_URL` (o el override
de `/config-api`) y que el backend responda en `http://localhost:5000/health`.

### Cómo verificar que se reconstruyó bien

```bash
docker ps                                   # contenedor Up sin reinicios
docker logs <container_id> | tail -20       # Nginx sin errores
docker images | grep keibeauty-frontend     # fecha de creación reciente
```
--