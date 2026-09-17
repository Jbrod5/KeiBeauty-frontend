<template>
  <div class="container py-4">
    <!-- Hero -->
    <section class="hero text-center p-5 mb-5 rounded-4">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <h1 class="display-4 fw-bold mb-2 hero-title">Bienvenido a KeiBeauty</h1>
          <p class="fs-4 fw-medium mb-3 hero-subtitle">Descubre el secreto de la belleza coreana</p>
          <p class="fs-5 mb-4 hero-description mx-auto" style="max-width: 600px;">
            Productos auténticos de K-Beauty para una piel radiante y saludable.
            Cuidado minimalista, ingredientes naturales, resultados visibles.
          </p>
          <router-link to="/catalogo" class="btn btn-primary btn-lg rounded-pill px-4 py-3 fw-semibold">
            Explorar Catálogo
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="row g-4 mb-5">
      <div class="col-12 col-md-4">
        <div class="card h-100 text-center p-4 shadow-sm">
          <div class="card-body">
            <div class="feature-icon-wrapper mb-3">
              <i class="bi bi-stars fs-1"></i>
            </div>
            <h3 class="h5 fw-bold mb-2 card-title-kei">Ingredientes Naturales</h3>
            <p class="small mb-0 card-text-kei">Fórmulas con extractos botánicos, ácido hialurónico y centella asiática.</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card h-100 text-center p-4 shadow-sm">
          <div class="card-body">
            <div class="feature-icon-wrapper mb-3">
              <i class="bi bi-leaf fs-1"></i>
            </div>
            <h3 class="h5 fw-bold mb-2 card-title-kei">Rutina Minimalista</h3>
            <p class="small mb-0 card-text-kei">Pocos pasos, máximo efecto. La filosofía coreana del "skinimalism".</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card h-100 text-center p-4 shadow-sm">
          <div class="card-body">
            <div class="feature-icon-wrapper mb-3">
              <i class="bi bi-truck fs-1"></i>
            </div>
            <h3 class="h5 fw-bold mb-2 card-title-kei">Envío Rápido</h3>
            <p class="small mb-0 card-text-kei">Entrega en 24-48h. Productos directamente de Corea a tu puerta.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section text-center p-5 rounded-4">
      <h2 class="h2 fw-bold mb-2">¿Lista para brillar?</h2>
      <p class="mb-4 cta-text">Tu piel te lo agradecerá. Comienza tu rutina K-Beauty hoy.</p>
      <router-link to="/catalogo" class="btn btn-outline-light btn-lg rounded-pill px-4 fw-semibold cta-outline-btn">
        Ver Productos
      </router-link>
    </section>
  </div>
</template>

<script setup>
// HomeView - vista de bienvenida estática, sin lógica adicional
</script>

<style scoped>
/* Hero con paleta oficial */
.hero {
  background-color: var(--kei-fondo);
  border: 1px solid var(--kei-gris-claro);
}
.hero-title {
  color: var(--kei-casi-negro);
}
.hero-subtitle {
  color: var(--kei-gris-oscuro);
}
.hero-description {
  color: var(--kei-gris-medio);
  line-height: 1.8;
}

/* Cards features */
.feature-icon-wrapper {
  color: var(--kei-beige);
}
.card-title-kei {
  color: var(--kei-casi-negro);
}
.card-text-kei {
  color: var(--kei-gris-medio);
}

/* CTA oscuro con paleta */
.cta-section {
  background-color: var(--kei-casi-negro);
  color: var(--kei-fondo);
}
.cta-text {
  color: var(--kei-gris-claro);
}
.cta-outline-btn {
  border-color: var(--kei-gris-claro);
  color: var(--kei-fondo);
}
.cta-outline-btn:hover {
  background-color: var(--kei-fondo);
  color: var(--kei-casi-negro);
}
</style>
