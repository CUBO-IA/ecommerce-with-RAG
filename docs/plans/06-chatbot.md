# Fase 6 — Chatbot

**Objetivo:** un asistente de ventas en la web que consulta el catálogo con búsqueda semántica.

> Verificar la API vigente de `ai` v7 (`streamText`, `tool`, `useChat`, conversión de mensajes) con la documentación antes de escribir. Las firmas cambiaron entre versiones.

## API — `app/api/chat/route.ts`

- [x] `POST` que recibe `messages` y responde con `streamText`:
  - modelo `haiku` de `src/ai/anthropic.ts`
  - límite de pasos para permitir tool → respuesta (`stopWhen` o equivalente en v7)
  - validar el body con zod y limitar la longitud del historial
- [x] System prompt (español):
  - rol: vendedor amable de la tienda
  - usar siempre `searchProducts` antes de recomendar o dar precios
  - no inventar productos, precios ni stock
  - si no hay resultados relevantes, decirlo y ofrecer otra búsqueda
  - respuestas cortas
- [x] Tool `searchProducts({ query: string })`: llama a `searchProducts` del dominio y devuelve `id, name, description, price (formateado), imageUrl`.
- [x] Tool `getProduct({ id: number })`: detalle de un producto.
- [x] Manejo de errores: mensaje claro si falla OpenRouter o Anthropic.

## UI — `src/components/ChatWidget.tsx`

- [x] Client Component con `useChat` apuntando a `/api/chat`.
- [x] Botón flotante abajo a la derecha que abre y cierra el panel.
- [x] Lista de mensajes con scroll automático, input y botón enviar, y estado "escribiendo".
- [x] Renderizar los resultados de `searchProducts` como `ProductCard` compactas dentro del chat.
- [x] Montar el widget en `app/layout.tsx`.
- [x] Accesibilidad: `aria-label` en el botón, foco en el input al abrir y cierre con Escape.

## Criterio de salida

- [x] Preguntar "¿qué tienen para regalar a un niño?" devuelve productos del catálogo y los muestra.
- [x] Una pregunta sin relación con el catálogo no inventa productos.
- [x] La respuesta llega en streaming y no rompe la página al cerrar y reabrir el panel.
