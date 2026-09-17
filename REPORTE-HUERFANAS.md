# REPORTE HUÉRFANAS — KeiBeauty Refactor UI/UX

Fecha: 2026-09-16
Rama: feature/refactor-ui-ux

## Auditoría de rutas vs navegación

### Rutas definidas en router/index.js (19)
- / (home) → link en navbar ✅
- /catalogo → navbar ✅
- /producto/:id → accesible via click en catalogo/favoritos/admin ✅ (TAREA 6)
- /carrito → navbar ✅
- /checkout → accesible desde carrito ✅
- /perfil → dropdown usuario ✅
- /perfil/favoritos → dropdown usuario ✅
- /mis-pedidos → dropdown usuario ✅
- /mis-pedidos/:id → desde historial ✅
- /admin → NUEVO dashboard hub ✅ (TAREA 4) — antes huérfano parcial (no existía)
- /admin/categorias → **HUÉRFANA antes**: existía `AdminCategoriesView.vue` importada pero SIN ruta definida. Se agregó en este refactor ✅ `router/index.js: categoras`
- /admin/resenas → dropdown admin (antes) → ahora vía dashboard ✅
- /admin/marcas → dropdown admin → ahora vía dashboard ✅
- /admin/productos → dropdown admin → ahora vía dashboard + card ✅
- /admin/pedidos → dropdown admin → ahora vía dashboard ✅
- /admin/pedidos/:id → desde lista pedidos admin ✅
- /login, /registro, /olvide-contrasena, /reestablecer-contrasena, /verificar-2fa → links auth ✅

### Huérfanas detectadas y resueltas
1. **/admin/categorias (Categorías)** — Vista existía desde feature/crud-categorias pero ruta nunca registrada. No había link en menú. **Resuelto**: agregada ruta `name: admin-categorias` y card en AdminDashboardView + entrada en navbar admin agregaría automáticamente via dashboard.
2. **AdminDashboardView inexistente** — navegación admin dispersa en dropdown con 5 items poco intuitivo. **Resuelto**: creado `AdminDashboardView.vue` hub con 6 cards (Productos, Categorías, Marcas, Pedidos, Reseñas, Inventario) + breadcrumb. Navbar ahora solo muestra "Panel Admin" → /admin.
3. **Inventario huérfano** — lógica `ajustarInventario` en AdminProductsView pero sin ruta dedicada. **Resuelto**: card "Inventario" en dashboard apunta a /admin/productos (mismo lugar donde se ajusta), documentado.

### Endpoints backend sin vista frontend
- Todos los endpoints tienen vista que los consume. Verificado `services/api.js`:
  - POST /pedidos/:id/guia (uploadGuia) → usado en AdminOrdersView ✅
  - POST /products/:id/inventario → AdminProductsView ✅
  - GET /resenas → AdminResenasView ✅
  - /marcas CRUD → AdminMarcasView ✅
  - /favoritos → FavoritosView + CatalogView ✅
- No huérfanos críticos. Endpoint `admin-test` en products.py es solo test, sin vista (intencional).

### Stores Pinia sin uso
- `authStore.js` → usado en App.vue, router guard, todas vistas auth ✅
- `cartStore.js` → usado en Catalog, ProductDetail, Cart, Checkout, App badge ✅
- `favoritosStore.js` → usado en Catalog, ProductDetail, Favoritos, Profile ✅
- Ningún store huérfano.

### Acciones/botones no accesibles
- Botón "Subir guía" en AdminOrdersView: accesible solo si usuario admin y pedido existe ✅
- Toggle favoritos en catálogo: requiere auth, muestra toast si no — accesible ✅
- Reseñas: botón en ProductDetail → requiere auth ✅

## Conclusión
3 funcionalidades huérfanas resueltas, 0 pendientes. Navegación ahora consolidada via dashboard.
