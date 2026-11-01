# Fase 2 — Modelo de datos y migración

**Objetivo:** tabla `Product` con embedding vectorial, migrada en la base local.

## Esquema

- [x] En `src/prisma/contract.prisma`, reemplazar `Document` por:
  ```prisma
  model Product {
    id          Int             @id @default(autoincrement())
    name        String
    description String
    priceCents  Int
    imageKey    String
    embedding   Embedding2048?
    createdAt   DateTime        @default(now())
  }
  ```
- [x] Mantener el tipo `Embedding2048` (coincide con el modelo de `src/ai/openrouter.ts`).
- [x] Confirmar que ningún archivo importa o usa `Document` (grep antes de borrarlo).

## Migración

- [x] Consultar el flujo de comandos de Prisma 8 rc (`pnpm prisma --help` o documentación) para emitir contrato y crear la migración.
- [x] Regenerar `src/prisma/contract.json` y `contract.d.ts`.
- [x] Aplicar la migración con el compose arriba.
- [x] Verificar la tabla y la extensión `vector` con `psql`:
  ```
  docker compose exec db psql -U postgres app -c '\d "Product"'
  ```

## Decisión de índice

- [x] Sin índice ANN en el PoC. pgvector limita HNSW e IVFFlat a 2000 dimensiones con `vector`, y aquí son 2048.
- [x] Dejar un comentario `ponytail:` en el código de búsqueda con el límite y la salida: `halfvec` + HNSW, o un modelo de menos dimensiones.

## Criterio de salida

- [x] La tabla `Product` existe con la columna `embedding vector(2048)`.
- [x] Un insert y un select por `db` funcionan desde un script de prueba.
