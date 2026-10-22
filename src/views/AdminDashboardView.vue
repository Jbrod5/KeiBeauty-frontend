<template>
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/catalogo">Catálogo</router-link></li>
        <li class="breadcrumb-item active">Panel Admin</li>
      </ol>
    </nav>

    <div class="d-flex align-items-center gap-3 mb-4">
      <div class="rounded-circle d-flex align-items-center justify-content-center" style="width:48px;height:48px;background:var(--kei-gris-oscuro);color:#fff;">
        <i class="bi bi-speedometer2 fs-4"></i>
      </div>
      <div>
        <h1 class="h3 mb-0" style="color:var(--kei-casi-negro)">Panel de Administración</h1>
        <small class="text-muted">Gestión centralizada de KeiBeauty</small>
      </div>
    </div>

    <div v-for="grupo in grupos" :key="grupo.titulo" class="mb-4">
      <h2 class="h6 fw-bold pb-2 mb-3 d-inline-block" style="color:var(--kei-casi-negro); border-bottom:2px solid var(--kei-beige-medio);">
        {{ grupo.titulo }}
      </h2>
      <div class="row g-4">
        <div class="col-12 col-sm-6 col-lg-4" v-for="card in grupo.tarjetas" :key="card.ruta + card.titulo">
          <router-link :to="card.ruta" class="text-decoration-none">
            <div class="card h-100 shadow-sm border-0 hover-lift">
              <div class="card-body p-4 text-center">
                <div class="rounded-3 d-inline-flex align-items-center justify-content-center mb-3" style="width:56px;height:56px;background:var(--kei-fondo);border:1px solid var(--kei-gris-claro);">
                  <i :class="card.icono" class="fs-3" style="color:var(--kei-gris-oscuro)"></i>
                </div>
                <h5 class="card-title mb-1" style="color:var(--kei-casi-negro)">{{ card.titulo }}</h5>
                <p class="card-text small text-muted mb-3">{{ card.descripcion }}</p>
                <span class="btn btn-outline-primary btn-sm rounded-pill">Abrir <i class="bi bi-arrow-right ms-1"></i></span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Las secciones van agrupadas por título para que se entienda de un vistazo
// qué se gestiona en cada área de la tienda.
const grupos = [
  {
    titulo: 'Productos',
    tarjetas: [
      { titulo: 'Productos', descripcion: 'Crear, editar y eliminar productos', icono: 'bi bi-box-seam', ruta: '/admin/productos' },
      { titulo: 'Categorías', descripcion: 'Gestionar categorías del catálogo', icono: 'bi bi-tags', ruta: '/admin/categorias' },
      { titulo: 'Marcas', descripcion: 'Administrar marcas K-Beauty', icono: 'bi bi-award', ruta: '/admin/marcas' },
      { titulo: 'Inventario', descripcion: 'Ajustes de stock desde Productos', icono: 'bi bi-boxes', ruta: '/admin/productos' }
    ]
  },
  {
    titulo: 'Pedidos',
    tarjetas: [
      { titulo: 'Pedidos', descripcion: 'Ver y actualizar estado de pedidos', icono: 'bi bi-receipt', ruta: '/admin/pedidos' }
    ]
  },
  {
    titulo: 'Reportes',
    tarjetas: [
      { titulo: 'Reseñas', descripcion: 'Moderar reseñas de clientes', icono: 'bi bi-star-half', ruta: '/admin/resenas' },
      { titulo: 'Reportes', descripcion: 'Ventas, ganancias y top productos/clientes', icono: 'bi bi-bar-chart-line', ruta: '/admin/reportes' },
      { titulo: 'Configuración', descripcion: 'Costo de envío y envío gratis', icono: 'bi bi-sliders', ruta: '/admin/configuracion' }
    ]
  }
]
</script>

<style scoped>
.hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
.hover-lift:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; }
</style>
