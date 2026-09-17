<template>
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Inicio</router-link></li>
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

    <div class="row g-4">
      <div class="col-12 col-sm-6 col-lg-4" v-for="card in cards" :key="card.ruta">
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

    <div class="alert mt-4" style="background:var(--kei-beige-claro);color:var(--kei-casi-negro);border-color:var(--kei-beige-medio);">
      <i class="bi bi-info-circle me-2"></i>
      Usá las tarjetas para navegar a cada sección. El menú superior también lleva a este dashboard.
    </div>
  </div>
</template>

<script setup>
const cards = [
  { titulo: 'Productos', descripcion: 'Crear, editar y eliminar productos', icono: 'bi bi-box-seam', ruta: '/admin/productos' },
  { titulo: 'Categorías', descripcion: 'Gestionar categorías del catálogo', icono: 'bi bi-tags', ruta: '/admin/categorias' },
  { titulo: 'Marcas', descripcion: 'Administrar marcas K-Beauty', icono: 'bi bi-award', ruta: '/admin/marcas' },
  { titulo: 'Pedidos', descripcion: 'Ver y actualizar estado de pedidos', icono: 'bi bi-receipt', ruta: '/admin/pedidos' },
  { titulo: 'Reseñas', descripcion: 'Moderar reseñas de clientes', icono: 'bi bi-star-half', ruta: '/admin/resenas' },
  { titulo: 'Inventario', descripcion: 'Ajustes de stock desde Productos', icono: 'bi bi-boxes', ruta: '/admin/productos' },
]
</script>

<style scoped>
.hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
.hover-lift:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; }
</style>
