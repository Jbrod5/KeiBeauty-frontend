---
name: docker-vue
description: Se activa al configurar el entorno de Docker para producción o desarrollo en la app de Vue, incluyendo configuraciones de Nginx y variables de entorno de Vite.
tools:
  - codebase_search
  - file_editor
---

# Contenedorización del Frontend con Docker y Nginx

## Contexto de Aplicación
Usa esta habilidad para gestionar los archivos de Docker o archivos de configuración del servidor web (como `nginx.conf`) encargados de servir la SPA de Vue 3.

## Reglas Estrictas de Configuración

1. **Estrategia Multi-Etapa Obligatoria:**
   - **Etapa 1 (Build):** Usar una imagen base de `node` para instalar dependencias y ejecutar `npm run build`.
   - **Etapa 2 (Production):** Copiar únicamente la carpeta resultante `dist/` a una imagen limpia de `nginx:alpine`.

2. **Configuración de Nginx para SPAs:**
   - Asegurar que el archivo de configuración de Nginx redirija todas las peticiones al `index.html` (`try_files $uri $uri/ /index.html;`) para no romper el enrutamiento de `vue-router`.

3. **Variables de Entorno en Vite:**
   - Recordar al usuario que las variables de entorno en el frontend deben llevar el prefijo `VITE_` (ej. `VITE_API_URL`) para que se inyecten correctamente durante el proceso de compilación.
