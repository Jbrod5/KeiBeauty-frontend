<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero-content">
        <h1>Bienvenido a KeiBeauty</h1>
        <p class="subtitle">Descubre el secreto de la belleza coreana</p>
        <p class="description">
          Productos auténticos de K-Beauty para una piel radiante y saludable.
          Cuidado minimalista, ingredientes naturales, resultados visibles.
        </p>
        <router-link to="/catalogo" class="cta-button">Explorar Catálogo</router-link>
      </div>
    </section>

    <section class="features">
      <div class="feature-card">
        <span class="feature-icon">✨</span>
        <h3>Ingredientes Naturales</h3>
        <p>Fórmulas con extractos botánicos, ácido hialurónico y centella asiática.</p>
      </div>
      <div class="feature-card">
        <span class="feature-icon">🌿</span>
        <h3>Rutina Minimalista</h3>
        <p>Pocos pasos, máximo efecto. La filosofía coreana del "skinimalism".</p>
      </div>
      <div class="feature-card">
        <span class="feature-icon">🚀</span>
        <h3>Envío Rápido</h3>
        <p>Entrega en 24-48h. Productos directamente de Corea a tu puerta.</p>
      </div>
    </section>

    <section class="cta-section">
      <h2>¿Lista para brillar?</h2>
      <p>Tu piel te lo agradecerá. Comienza tu rutina K-Beauty hoy.</p>
      <router-link to="/catalogo" class="cta-button secondary">Ver Productos</router-link>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 4rem 1rem;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  border-radius: 1rem;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.5rem;
  color: #e91e63;
  margin-bottom: 1rem;
  font-weight: 500;
}

.description {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.8;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: #e91e63;
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.2s;
}

.cta-button:hover {
  background: #c2185b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
}

.cta-button.secondary {
  background: transparent;
  border: 2px solid #e91e63;
  color: #e91e63;
}

.cta-button.secondary:hover {
  background: #e91e63;
  color: white;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.feature-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #666;
  font-size: 0.95rem;
}

.cta-section {
  text-align: center;
  padding: 3rem 1rem;
  background: #2c3e50;
  border-radius: 1rem;
  color: white;
}

.cta-section h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.cta-section p {
  color: #ccc;
  margin-bottom: 1.5rem;
}
</style>