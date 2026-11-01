# Fase 3 — Capa de dominio (S3 + productos + búsqueda)

**Objetivo:** funciones reutilizables que usarán el admin, la tienda y el bot. Sin UI todavía.

## Cliente S3 — `src/s3/client.ts`

- [x] Crear `S3Client` con `endpoint: env.S3_ENDPOINT`, `region: "us-east-1"`, `forcePathStyle: true` y credenciales del env.
- [x] `uploadImage(file: File): Promise<string>`:
  - genera la key `crypto.randomUUID()` + extensión según el MIME
  - `PutObjectCommand` con `ContentType`
  - devuelve la key
- [x] `deleteImage(key)` con `DeleteObjectCommand`.
- [x] `imageUrl(key)` devuelve `${env.S3_PUBLIC_URL}/${key}`.

## Productos — `src/products/index.ts`

- [x] Esquema zod `productInput`: `name` (1–120), `description` (1–2000), `price` (número > 0, convertido a centavos).
- [x] Validación de imagen: MIME en `image/jpeg|png|webp`, tamaño máximo 5 MB.
- [x] `createProduct(input, file)`:
  1. valida
  2. `uploadImage`
  3. `embed(\`${name}\n${description}\`)`
  4. inserta con `db`
  5. si el insert falla, borra la imagen subida (evita huérfanos)
- [x] `listProducts()` ordenado por `createdAt` desc, sin traer el embedding.
- [x] `getProduct(id)`.
- [x] `deleteProduct(id)`: borra la fila y luego la imagen.
- [x] `searchProducts(query, limit = 5)`:
  1. `embed(query)`
  2. orden por distancia coseno con la API del contrato (`cosineDistance`), o SQL crudo con `<=>` si el rc no la expone
  3. devuelve `id, name, description, priceCents, imageUrl`
  4. comentario `ponytail:` sobre el scan secuencial

## Prueba (única de la fase)

- [x] Una prueba de `searchProducts` o de su consulta de orden:
  - insertar 3 productos con vectores fijos conocidos
  - verificar que el top-1 es el más cercano a la consulta
  - evitar llamar a OpenRouter: inyectar el vector, o separar la consulta de distancia en una función que reciba el vector
- [x] Decidir el ejecutor de pruebas. Decidido: `node --test` nativo (Node 24 ejecuta `.ts`), sin dependencias. Script `pnpm test`, prueba en `src/products/nearest.test.mts`. Requiere imports relativos con extensión (`allowImportingTsExtensions` en tsconfig).

## Criterio de salida

- [x] Un script ad hoc crea, busca y borra un producto contra RustFS y Postgres.
- [x] La prueba del orden de similitud pasa.
- [x] `pnpm lint` y `tsc --noEmit` sin errores.
