<template>
  <div class="container py-4 py-lg-5">
    <!-- Hero -->
    <section class="hero-nosotros position-relative overflow-hidden text-center p-4 p-md-5 mb-5 rounded-4">
      <!-- Vector decorativo sutil: ondas + hojas -->
      <svg class="hero-vector hero-vector-arriba" viewBox="0 0 400 120" fill="none" aria-hidden="true">
        <path d="M0 60 C 80 10, 160 110, 240 60 S 360 20, 400 70" stroke="var(--kei-oliva-claro)" stroke-width="2" stroke-linecap="round"/>
        <path d="M0 90 C 90 50, 180 130, 270 85 S 360 55, 400 95" stroke="var(--kei-oliva-claro)" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
        <g stroke="var(--kei-oliva)" stroke-width="1.5" fill="none" opacity="0.7">
          <path d="M330 20 q 12 -14 26 -12 q -4 14 -16 16 q 4 -8 2 -12" />
          <path d="M352 30 q 10 -4 18 2" stroke-linecap="round"/>
        </g>
      </svg>
      <svg class="hero-vector hero-vector-abajo" viewBox="0 0 400 120" fill="none" aria-hidden="true">
        <path d="M0 50 C 70 100, 170 10, 250 55 S 350 95, 400 45" stroke="var(--kei-oliva-claro)" stroke-width="2" stroke-linecap="round"/>
        <path d="M0 25 C 80 65, 190 -5, 280 35 S 360 60, 400 20" stroke="var(--kei-oliva-claro)" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
        <g stroke="var(--kei-oliva)" stroke-width="1.5" fill="none" opacity="0.7">
          <circle cx="55" cy="70" r="6"/>
          <path d="M55 76 q 0 10 -7 14 M55 76 q 0 10 7 14" stroke-linecap="round"/>
        </g>
      </svg>
      <div class="row justify-content-center position-relative">
        <div class="col-12 col-lg-8">
          <span class="badge rounded-pill px-3 py-2 mb-3 hero-insignia">
            <i class="bi bi-stars me-1"></i>Desde 2021 · Xela, Guatemala
          </span>
          <h1 class="display-4 fw-bold mb-2 hero-titulo font-display">Kei Esencia</h1>
          <p class="fs-5 fw-medium mb-3 hero-subtitulo">Tu ritual esencial — Skincare, K-Beauty, Cabello · Xela, Guatemala</p>
          <p class="fs-6 mb-4 hero-descripcion mx-auto" style="max-width: 620px;">
            Cosméticos coreanos originales, directos a tu puerta.
            Cuidado minimalista, ingredientes honestos, resultados visibles.
          </p>
          <router-link to="/catalogo" class="btn btn-primary btn-lg rounded-pill px-4 py-2 fw-semibold">
            <i class="bi bi-bag-heart me-2"></i>Ver catálogo
          </router-link>
        </div>
      </div>
    </section>

    <!-- Qué es Kei Beauty -->
    <section class="row align-items-center g-4 g-lg-5 mb-5 py-3">
      <div class="col-12 col-lg-6">
        <p class="seccion-etiqueta mb-2"><i class="bi bi-flower1 me-1"></i>Quiénes somos</p>
        <h2 class="fw-bold mb-3 seccion-titulo font-display">Qué es Kei Beauty</h2>
        <p class="seccion-texto mb-3">
          <strong>Kei Beauty</strong> (registrada comercialmente en redes como
          <strong>Kei Esencia</strong>) es una empresa guatemalteca fundada en
          <strong>2021</strong> dedicada a la comercialización e importación de
          productos coreanos de belleza (K-Beauty), enfocados en el cuidado de
          la piel (skincare) y del cabello.
        </p>
        <p class="seccion-texto mb-0">
          Nacimos en Quetzaltenango para acercar la filosofía coreana del cuidado
          personal a Guatemala: pocos pasos, ingredientes honestos y constancia
          diaria. Hoy damos el salto a tienda en línea para atenderte más rápido,
          sin depender de mensajes manuales en redes sociales.
        </p>
      </div>
      <div class="col-12 col-lg-6">
        <!-- Ilustración vectorial: frasco + hojas + gotas -->
        <div class="ilustracion rounded-4 p-4 text-center">
          <svg viewBox="0 0 320 220" fill="none" class="w-100" style="max-height: 260px;" role="img" aria-label="Ilustración de frasco cosmético con hojas y gotas">
            <!-- Círculo fondo suave -->
            <circle cx="160" cy="110" r="95" fill="var(--kei-oliva-suave)"/>
            <circle cx="160" cy="110" r="95" stroke="var(--kei-oliva-claro)" stroke-width="2"/>
            <!-- Frasco -->
            <rect x="128" y="95" width="64" height="80" rx="10" fill="#fff" stroke="var(--kei-gris-oscuro)" stroke-width="2.5"/>
            <rect x="138" y="72" width="44" height="18" rx="4" fill="var(--kei-oliva)" />
            <rect x="146" y="58" width="28" height="14" rx="3" fill="var(--kei-gris-oscuro)"/>
            <!-- Etiqueta del frasco -->
            <rect x="138" y="120" width="44" height="30" rx="4" fill="var(--kei-oliva-suave)" stroke="var(--kei-oliva)" stroke-width="1.5"/>
            <path d="M146 135 q 7 -10 14 0 q -7 6 -14 0" stroke="var(--kei-oliva-oscuro)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            <!-- Hojas -->
            <g stroke="var(--kei-oliva-oscuro)" stroke-width="2" fill="none" stroke-linecap="round">
              <path d="M228 150 q 26 -6 32 -30 q -26 2 -32 30"/>
              <path d="M232 146 q 12 -8 22 -18"/>
              <path d="M92 155 q -24 -8 -28 -30 q 24 4 28 30"/>
              <path d="M88 151 q -10 -8 -18 -18"/>
            </g>
            <!-- Gotas -->
            <g stroke="var(--kei-oliva)" stroke-width="2" fill="none">
              <path d="M238 70 q 8 12 0 18 q -8 -6 0 -18"/>
              <path d="M82 70 q 7 10 0 15 q -7 -5 0 -15"/>
            </g>
            <!-- Pétalos / destellos -->
            <g fill="var(--kei-oliva-claro)">
              <circle cx="110" cy="60" r="3"/>
              <circle cx="215" cy="55" r="3"/>
              <circle cx="255" cy="110" r="2.5"/>
              <circle cx="65" cy="110" r="2.5"/>
            </g>
          </svg>
        </div>
      </div>
    </section>

    <!-- Objetivos y pretensiones -->
    <section class="mb-5">
      <div class="text-center mb-4">
        <p class="seccion-etiqueta mb-2"><i class="bi bi-compass me-1"></i>Nuestro rumbo</p>
        <h2 class="fw-bold seccion-titulo font-display">Objetivos y pretensiones</h2>
      </div>
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm rounded-3 p-2">
            <div class="card-body p-4">
              <div class="icono-bloque mb-3">
                <i class="bi bi-lightning-charge fs-3"></i>
              </div>
              <h3 class="h5 fw-bold mb-2 card-titulo-kei font-display">Nuestro objetivo</h3>
              <p class="mb-0 seccion-texto">
                Brindar acceso directo y ágil a cosméticos coreanos originales en
                Guatemala, eliminando las barreras de atención manual en redes
                sociales mediante un e-commerce centralizado, rápido e intuitivo.
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm rounded-3 p-2">
            <div class="card-body p-4">
              <div class="icono-bloque mb-3">
                <i class="bi bi-graph-up-arrow fs-3"></i>
              </div>
              <h3 class="h5 fw-bold mb-2 card-titulo-kei font-display">Nuestra pretensión</h3>
              <p class="mb-0 seccion-texto">
                Consolidarse como la tienda en línea referente de K-Beauty en el
                suroccidente y todo el territorio de Guatemala, incrementando su
                alcance de clientes y escalando las ventas con un flujo
                automatizado de pedidos y control de stock en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Marcas -->
    <section class="mb-5">
      <div class="text-center mb-4">
        <p class="seccion-etiqueta mb-2"><i class="bi bi-award me-1"></i>Curaduría Kei</p>
        <h2 class="fw-bold seccion-titulo font-display">Marcas que ofrecemos</h2>
        <p class="seccion-texto mx-auto" style="max-width: 640px;">
          Selección corta y honesta: trabajamos las marcas que conocemos,
          probamos y recomendamos.
        </p>
      </div>
      <div class="row g-4">
        <div class="col-12 col-md-4" v-for="marca in marcas" :key="marca.nombre">
          <div class="card h-100 shadow-sm rounded-3 text-center p-2">
            <div class="card-body p-4">
              <div class="monograma mx-auto mb-3">{{ marca.inicial }}</div>
              <h3 class="h5 fw-bold mb-1 card-titulo-kei font-display">{{ marca.nombre }}</h3>
              <span class="badge rounded-pill mb-3" :class="marca.principal ? 'marca-principal' : 'marca-complementaria'">
                {{ marca.principal ? 'Coreana · Principal' : 'Complementaria' }}
              </span>
              <p class="small mb-0 seccion-texto">{{ marca.descripcion }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cosméticos: Skincare + Haircare -->
    <section class="mb-5">
      <div class="text-center mb-4">
        <p class="seccion-etiqueta mb-2"><i class="bi bi-droplet-half me-1"></i>Nuestro enfoque</p>
        <h2 class="fw-bold seccion-titulo font-display">Cosméticos en los que nos centramos</h2>
      </div>
      <div class="row g-4">
        <!-- Skincare -->
        <div class="col-12 col-lg-6">
          <div class="card h-100 shadow-sm rounded-3 overflow-hidden">
            <div class="bloque-encabezado p-4 d-flex align-items-center gap-3">
              <svg viewBox="0 0 64 64" fill="none" class="bloque-vector" aria-hidden="true">
                <path d="M32 8 q 12 16 12 26 a12 12 0 1 1 -24 0 q 0 -10 12 -26" stroke="var(--kei-oliva-oscuro)" stroke-width="3" fill="var(--kei-oliva-suave)" stroke-linejoin="round"/>
                <path d="M26 36 q 3 6 9 7" stroke="var(--kei-oliva-oscuro)" stroke-width="2" stroke-linecap="round"/>
                <path d="M10 52 q 11 -6 22 0 t 22 0" stroke="var(--kei-oliva-claro)" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
              <div>
                <h3 class="h4 fw-bold mb-1 font-display" style="color: var(--kei-casi-negro);">Skincare</h3>
                <p class="mb-0 small" style="color: var(--kei-gris-medio);">Cuidado facial · rutina coreana por pasos</p>
              </div>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex align-items-center gap-3" v-for="item in skincare" :key="item">
                <i class="bi bi-check-circle-fill" style="color: var(--kei-oliva);"></i>
                <span class="seccion-texto">{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- Haircare -->
        <div class="col-12 col-lg-6">
          <div class="card h-100 shadow-sm rounded-3 overflow-hidden">
            <div class="bloque-encabezado p-4 d-flex align-items-center gap-3">
              <svg viewBox="0 0 64 64" fill="none" class="bloque-vector" aria-hidden="true">
                <rect x="24" y="14" width="16" height="34" rx="8" stroke="var(--kei-oliva-oscuro)" stroke-width="3" fill="var(--kei-oliva-suave)"/>
                <path d="M24 24 h16" stroke="var(--kei-oliva-oscuro)" stroke-width="2"/>
                <path d="M32 6 v8 M22 10 l4 5 M42 10 l-4 5" stroke="var(--kei-oliva-claro)" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M10 54 q 11 -6 22 0 t 22 0" stroke="var(--kei-oliva-claro)" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
              <div>
                <h3 class="h4 fw-bold mb-1 font-display" style="color: var(--kei-casi-negro);">Haircare</h3>
                <p class="mb-0 small" style="color: var(--kei-gris-medio);">Cuidado del cabello · nutrición y reparación</p>
              </div>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex align-items-center gap-3" v-for="item in haircare" :key="item">
                <i class="bi bi-check-circle-fill" style="color: var(--kei-oliva);"></i>
                <span class="seccion-texto">{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Datos de la tienda -->
    <section class="tira-datos rounded-4 p-4 p-md-5 mb-5">
      <div class="row g-4 text-center">
        <div class="col-6 col-lg-3">
          <i class="bi bi-calendar-heart fs-3 d-block mb-2" style="color: var(--kei-oliva);"></i>
          <p class="fw-bold mb-0 font-display" style="color: var(--kei-casi-negro);">2021</p>
          <small style="color: var(--kei-gris-medio);">Fundación en Xela</small>
        </div>
        <div class="col-6 col-lg-3">
          <i class="bi bi-geo-alt fs-3 d-block mb-2" style="color: var(--kei-oliva);"></i>
          <p class="fw-bold mb-0 font-display" style="color: var(--kei-casi-negro);">Quetzaltenango</p>
          <small style="color: var(--kei-gris-medio);">Envíos a toda Guatemala</small>
        </div>
        <div class="col-6 col-lg-3">
          <i class="bi bi-patch-check fs-3 d-block mb-2" style="color: var(--kei-oliva);"></i>
          <p class="fw-bold mb-0 font-display" style="color: var(--kei-casi-negro);">100% originales</p>
          <small style="color: var(--kei-gris-medio);">Importación directa</small>
        </div>
        <div class="col-6 col-lg-3">
          <i class="bi bi-whatsapp fs-3 d-block mb-2" style="color: var(--kei-oliva);"></i>
          <p class="fw-bold mb-0 font-display" style="color: var(--kei-casi-negro);">3971 8418</p>
          <small><a :href="whatsappUrl" target="_blank" rel="noopener" class="text-decoration-none" style="color: var(--kei-oliva-oscuro);">Escríbenos por WhatsApp</a></small>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="cta-final text-center p-4 p-md-5 rounded-4">
      <svg viewBox="0 0 200 40" fill="none" class="mx-auto mb-3 d-block" style="width: 140px;" aria-hidden="true">
        <path d="M5 25 C 50 5, 100 35, 150 15 S 185 20, 195 12" stroke="var(--kei-oliva-claro)" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="100" cy="20" r="3" fill="var(--kei-oliva)"/>
        <circle cx="60" cy="18" r="2" fill="var(--kei-oliva-claro)"/>
        <circle cx="140" cy="22" r="2" fill="var(--kei-oliva-claro)"/>
      </svg>
      <h2 class="h2 fw-bold mb-2 font-display" style="color: var(--kei-fondo);">Empezá tu ritual hoy</h2>
      <p class="mb-4" style="color: var(--kei-gris-claro);">Explorá el catálogo completo y encontrá tu rutina ideal.</p>
      <router-link to="/catalogo" class="btn btn-primary btn-lg rounded-pill px-4 fw-semibold">
        <i class="bi bi-bag-heart me-2"></i>Explorar el catálogo completo
      </router-link>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// SobreNosotrosView (landing informativa): contenido estático de la empresa,
// sin llamadas a la API. Solo calcula la URL de WhatsApp desde entorno.
const whatsappUrl = computed(
  () => import.meta.env.VITE_WHATSAPP_URL || 'https://wa.me/50239718418'
)

// Marcas reales ofrecidas por la tienda
const marcas = [
  {
    nombre: 'Centella · Skin1004',
    inicial: 'C',
    principal: true,
    descripcion: 'Marca coreana insignia de centella asiática de Madagascar: calma, repara e hidrata todo tipo de piel.'
  },
  {
    nombre: 'Tocobo',
    inicial: 'T',
    principal: true,
    descripcion: 'Marca coreana intuitiva y minimalista: protectores solares ligeros y esenciales de rutina diaria.'
  },
  {
    nombre: 'Lilipink',
    inicial: 'L',
    principal: false,
    descripcion: 'Línea complementaria de cuidado personal y capilar para completar tu rutina de belleza.'
  }
]

// Líneas de producto por enfoque
const skincare = [
  'Limpiadores',
  'Tónicos',
  'Sueros / ampollas',
  'Cremas hidratantes',
  'Protectores solares'
]
const haircare = [
  'Tratamientos',
  'Mascarillas',
  'Aceites',
  'Cremas para peinar'
]
</script>

<style scoped>
/* Hero con fondo suave de paleta y vectores decorativos */
.hero-nosotros {
  background-color: var(--kei-oliva-suave);
  border: 1px solid var(--kei-oliva-claro);
}
.hero-vector {
  position: absolute;
  width: 45%;
  max-width: 420px;
  pointer-events: none;
}
.hero-vector-arriba { top: -10px; right: -20px; }
.hero-vector-abajo { bottom: -10px; left: -20px; }
.hero-insignia {
  background-color: #fff;
  color: var(--kei-oliva-oscuro);
  border: 1px solid var(--kei-oliva-claro);
}
.hero-titulo { color: var(--kei-casi-negro); }
.hero-subtitulo { color: var(--kei-gris-oscuro); }
.hero-descripcion { color: var(--kei-gris-medio); line-height: 1.8; }

/* Secciones */
.seccion-etiqueta {
  color: var(--kei-oliva-oscuro);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.seccion-titulo { color: var(--kei-casi-negro); }
.seccion-texto { color: var(--kei-gris-medio); line-height: 1.8; }

/* Ilustración */
.ilustracion {
  background-color: #fff;
  border: 1px solid var(--kei-gris-claro);
}

/* Icono en bloque oliva suave */
.icono-bloque {
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background-color: var(--kei-oliva-suave);
  color: var(--kei-oliva-oscuro);
  border: 1px solid var(--kei-oliva-claro);
}
.card-titulo-kei { color: var(--kei-casi-negro); }

/* Monogramas de marca */
.monograma {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  background-color: var(--kei-oliva-suave);
  color: var(--kei-oliva-oscuro);
  border: 2px solid var(--kei-oliva-claro);
}
.marca-principal {
  background-color: var(--kei-oliva) !important;
  color: #fff !important;
}
.marca-complementaria {
  background-color: var(--kei-gris-oscuro) !important;
  color: var(--kei-fondo) !important;
}

/* Encabezados de bloques skincare/haircare */
.bloque-encabezado {
  background-color: var(--kei-oliva-suave);
  border-bottom: 1px solid var(--kei-oliva-claro);
}
.bloque-vector { width: 56px; height: 56px; flex-shrink: 0; }

/* Tira de datos */
.tira-datos {
  background-color: #fff;
  border: 1px solid var(--kei-gris-claro);
}

/* CTA final oscuro, coherente con el resto del sitio */
.cta-final { background-color: var(--kei-casi-negro); }
</style>
