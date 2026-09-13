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

## Flujo de Trabajo y Reglas Estrictas

1. **Sintaxis Moderna (Composition API):**
   - Utilizar exclusivamente `<script setup>` con Composition API en todos los archivos `.vue`.
   - Mantener las directivas de reactividad (`ref`, `computed`, `reactive`) bien estructuradas y limpias.

2. **Estilos e Identidad Visual (K-Beauty):**
   - Utilizar estilos encapsulados (`<style scoped>`) o librerías CSS configuradas en el proyecto de forma consistente.
   - Respetar la paleta de colores y componentes visuales dedicados a la estética minimalista del cuidado de la piel.

3. **Gestión de Estado Global (Pinia):**
   - Administrar los estados globales críticos (como la autenticación de usuarios o el estado actual del carrito de compras) únicamente mediante tiendas independientes de Pinia.
   - No guardar la persistencia de datos volátiles directamente en los componentes si estos afectan a otras vistas.

4. **Consumo de API y UX (Axios):**
   - Controlar estrictamente los estados de carga (`loading = true/false`) y el manejo de errores al realizar peticiones HTTP mediante Axios.
   - Asegurar que la interfaz muestre indicadores visuales (spinners o mensajes de error amigables) para que el usuario sepa si una operación en el checkout o carrito falló o sigue procesándose.
