# Mini tienda PoC con chatbot RAG

Tienda en línea mínima. Los productos tienen imagen, descripción y precio, y se guardan con su embedding en pgvector. Un chatbot web ayuda a consultar y elegir productos.

## Fases

- [x] [Fase 1 — Infraestructura (RustFS + env)](./01-infra.md)
- [x] [Fase 2 — Modelo de datos y migración](./02-datos.md)
- [x] [Fase 3 — Capa de dominio (S3 + productos + búsqueda)](./03-dominio.md)
- [x] [Fase 4 — Admin: registro de productos](./04-admin.md)
- [x] [Fase 5 — Tienda pública](./05-tienda.md)
- [x] [Fase 6 — Chatbot](./06-chatbot.md)
- [x] [Fase 7 — Verificación end-to-end](./07-verificacion.md)

## Decisiones por defecto (cambiar si no aplican)

| Tema | Decisión |
|------|----------|
| Auth | Ninguna. `/admin/*` queda abierto (solo PoC) |
| Embedding | `nvidia/nemotron-3.5-embed-1b:free`, 2048 dims, scan secuencial (sin índice ANN) |
| Imágenes | Una por producto, en RustFS (bucket público de lectura) |
| Moneda | USD, precio guardado en centavos |
| Idioma | UI y bot en español |
| "Venta" | El bot recomienda y muestra productos. Sin carrito ni pago (fase futura) |
| Dependencias nuevas | Solo `@aws-sdk/client-s3` |

## Stack existente

Next 16, React 19, Tailwind 4, pnpm, Prisma 8 rc con pgvector, AI SDK v7 (`ai`, `@ai-sdk/anthropic`), OpenRouter para embeddings, zod.

> **Nota:** `AGENTS.md` indica que este Next tiene cambios incompatibles. Antes de escribir código de rutas o Server Actions, leer la guía correspondiente en `node_modules/next/dist/docs/`.

## Estructura objetivo

```
app/
  page.tsx                      # grilla pública
  admin/products/page.tsx       # formulario + listado
  admin/products/actions.ts     # server actions
  api/chat/route.ts             # streamText + tools
src/
  ai/                           # ya existe (embed, haiku)
  const/index.ts                # env zod
  prisma/                       # contrato y db
  s3/client.ts                  # cliente S3
  products/index.ts             # create, list, delete, search
  components/                   # ProductCard, ChatWidget
docker-compose.yml              # db + rustfs + bucket init
```

## Fuera de alcance

Auth, carrito, checkout, múltiples imágenes, paginación, caché, índices ANN, CI.
