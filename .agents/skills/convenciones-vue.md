---
name: convenciones-vue
description: Se activa al crear, modificar o auditar componentes de Vue 3, vistas, rutas, estilos o interacciones con Pinia y Axios en el frontend de KeiBeauty.
tools:
  - codebase_search
  - file_editor
---

# Creación de Componentes Vue 3 - KeiBeauty

## Contexto de Aplicación
Utiliza esta habilidad siempre que el usuario solicite implementar nuevas interfaces, ajustar la interactividad de la UI, conectar componentes con tiendas globales o consumir los servicios del backend.

## 1. Sintaxis Moderna (Composition API)
- Utilizar exclusivamente `<script setup>` con Composition API en todos los archivos `.vue`.
- Mantener las directivas de reactividad (`ref`, `computed`, `reactive`) bien estructuradas y limpias.
- Comentarios y nombres en español.

## 2. Paleta Oficial KeiBeauty (OBLIGATORIA)

### Variables CSS (definidas en `src/assets/estilos/paleta.css`)
```css
:root {
  --kei-gris-oscuro: #4D4D59;   /* gris oscuro principal - primario */
  --kei-gris-medio: #565659;    /* gris medio - secundario */
  --kei-casi-negro: #3A3E40;    /* casi negro - texto/headers */
  --kei-gris-claro: #D9D9D7;    /* gris claro - bordes/sutil */
  --kei-beige: #737166;         /* beige grisaceo - acento */
  --kei-beige-medio: #8C8A80;   /* beige medio */
  --kei-beige-claro: #A6A498;   /* beige claro - fondos suaves */
  --kei-fondo: #F2F2F2;         /* fondo claro - body */
  --kei-negro: #0D0D0D;         /* negro puro - contraste */
}
```

### Reglas de uso de color
- **SOLO** usar colores de la paleta vía variables CSS o clases utilitarias `.bg-kei-*`, `.text-kei-*`, `.border-kei-*`.
- **PROHIBIDO**: colores hardcodeados fuera de la paleta (`#fff`, `#000`, `#e91e63`, `red`, `blue`, `rgb(...)` arbitrario).
- **Excepciones**: `white` solo si es `#F2F2F2` o `var(--kei-fondo)`; `transparent` permitido.
- Overrides de Bootstrap DEBEN usar variables: `.btn-primary { background: var(--kei-gris-oscuro) }`.

### Mapeo Bootstrap → Paleta
| Bootstrap | Variable |
|-----------|----------|
| `btn-primary`, `bg-primary`, `text-primary`, `border-primary` | `var(--kei-gris-oscuro)` |
| `btn-secondary`, `bg-secondary` | `var(--kei-beige)` |
| `bg-light`, `card`, `navbar` | `var(--kei-fondo)` / `white` con borde `var(--kei-gris-claro)` |
| `text-dark`, `navbar-dark` | `var(--kei-casi-negro)` / `var(--kei-negro)` |
| `badge` primario | `var(--kei-gris-oscuro)` |
| `alert-info` | `var(--kei-beige-claro)` con texto `var(--kei-casi-negro)` |
| `form-control:focus` | `border-color: var(--kei-beige-medio)` + `box-shadow` con `rgba(77,77,89,0.15)` |

## 3. Estilos e Identidad Visual
- **Solo Bootstrap + paleta**: Usar clases Bootstrap (`container`, `row`, `col-*`, `card`, `btn`, `badge`, `table`, `form-control`, `form-select`, `alert`, `modal`, `navbar`, `breadcrumb`). Evitar CSS custom si Bootstrap lo resuelve.
- **CSS custom mínimo**: Solo cuando Bootstrap no cubre el caso; usar `<style scoped>` y variables de paleta.
- **Coherencia**: mismos `padding` (`p-3`, `p-4`), `border-radius` (`rounded-3` ≈ 0.75rem), `gap` (`gap-3`), sombras suaves.
- **Mobile-first**: Verificar responsive en cada vista (`col-12 col-md-6 col-lg-4` etc.).

### Ejemplos con paleta
```vue
<!-- Botones -->
<button class="btn btn-primary">Primario (gris oscuro)</button>
<button class="btn btn-outline-primary">Outline</button>
<button class="btn btn-secondary">Secundario (beige)</button>

<!-- Card -->
<div class="card border-0 shadow-sm rounded-3">
  <div class="card-body">
    <span class="badge bg-primary">Nuevo</span>
  </div>
</div>

<!-- Badge stock -->
<span class="badge" style="background: var(--kei-gris-oscuro)">Disponible</span>
<span class="badge" style="background: var(--kei-beige)">Agotado</span>

<!-- Form -->
<input class="form-control" style="border-color: var(--kei-gris-claro)" />
<select class="form-select"></select>

<!-- Alert -->
<div class="alert" style="background: var(--kei-beige-claro); color: var(--kei-casi-negro)"></div>
```

## 4. Librería de Iconos Vectoriales (OBLIGATORIA)
- **Elegida: Bootstrap Icons (`bootstrap-icons`)** — MIT, 2000+ iconos, coherente con Bootstrap 5.
- Instalación: `npm i bootstrap-icons` + `import 'bootstrap-icons/font/bootstrap-icons.css'` en `main.js`.
- **PROHIBIDO usar emojis** en vistas, componentes, stores, toasts, placeholders, botones, badges, navbar, footer, estados vacíos.
- Uso: `<i class="bi bi-bag-heart"></i>` / `<i class="bi bi-search"></i>` / `<i class="bi bi-cart3"></i>`.
- Alternativas descartadas: Lucide, Heroicons, Phosphor — se eligió Bootstrap Icons por no añadir dependencia visual extra.
- Verificación: `grep -rP "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" src/` debe dar 0 resultados en `.vue/.js/.css`.

## 5. Convenciones de Nombres (ESPAÑOL)
- **Archivos**: `kebab-case` en español: `CatalogoView.vue`, `DetalleProductoView.vue`, `CarritoStore.js` → preferir `catalogoStore.js`, `autenticacionStore.js`. Mantener sufijos `View`, `Store` si ya existen pero traducir base.
- **Componentes**: `PascalCase` español: `BarraNavegacion.vue`, `TarjetaProducto.vue`, `PiePagina.vue`.
- **Variables/funciones**: `camelCase` español: `productos`, `categoriaSeleccionada`, `agregarAlCarrito`, `cargando`, `obtenerProductos`.
- **Stores Pinia**: `useCarritoStore`, `useAutenticacionStore`, `useFavoritosStore`.
- **Servicios**: `src/servicios/api.js` (mantener `services/api.js` si migración gradual, pero nuevos en español).
- **Comentarios**: Siempre en español.
- **Contratos HTTP**: NO romper (`/api/products`, `/api/auth/login` se mantienen en inglés por backend).

## 6. Estructura de Carpetas
```
src/
├── assets/estilos/
│   ├── paleta.css        # variables + overrides Bootstrap
│   └── base.css          # reset mínimo si necesario
├── componentes/
│   ├── BarraNavegacion.vue
│   ├── PiePagina.vue
│   ├── TarjetaProducto.vue
│   └── ...
├── vistas/               # o views/ en migración
│   ├── InicioView.vue
│   ├── CatalogoView.vue
│   └── Admin/
│       ├── PanelAdminView.vue
│       └── ...
├── tiendas/               # o stores/
│   ├── autenticacionStore.js
│   ├── carritoStore.js
│   └── favoritosStore.js
├── servicios/
│   └── api.js
└── router/index.js
```

## 7. Gestión de Estado Global (Pinia)
- Administrar `autenticacion` y `carrito` únicamente con Pinia.
- No persistir datos volátiles en componentes.
- Estructura: `ref` para estado, `computed` para derivados, `async function` para acciones con `try/catch` + `loading`.

## 8. Consumo de API y UX (Axios)
- Controlar `cargando = true/false` y manejo de errores en cada petición Axios.
- Mostrar `spinner` (`<div class="spinner-border">`) o `alert` amigable en error.
- Toasts con `vue-toastification` con mensajes en español.

## 9. Prohibiciones
- ❌ Emojis.
- ❌ Colores fuera de paleta.
- ❌ CSS custom que Bootstrap resuelve.
- ❌ Nombres en inglés para archivos/variables nuevas.
- ❌ `console.log` en producción.
- ❌ Rutas sin `meta` de auth.

## 10. Verificación Obligatoria
- `npm run build` sin errores.
- `grep -rP emojis src/` = 0.
- `grep -rn "#[0-9a-fA-F]" src/` solo variables paleta.
- Checklist navegador con ✅/❌.
