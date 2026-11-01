# Fase 1 — Infraestructura (RustFS + env)

**Objetivo:** tener Postgres y un S3 local con bucket público levantados con `docker compose up`.

## Compose

- [x] Agregar el servicio `rustfs` a `docker-compose.yml`:
  - imagen `rustfs/rustfs:latest` (confirmar tag y variables en la documentación oficial)
  - puertos `9000:9000` (API S3) y `9001:9001` (consola)
  - volumen `rustfsdata`
  - variables de acceso (`RUSTFS_ACCESS_KEY`, `RUSTFS_SECRET_KEY`; verificar nombres)
- [x] Declarar el volumen `rustfsdata` en `volumes:`.
- [x] Agregar un servicio one-shot `rustfs-init` (imagen `minio/mc` o `amazon/aws-cli`) con `depends_on: rustfs`:
  - crea el bucket `products` si no existe
  - aplica política de lectura anónima (`GetObject`) al bucket
  - `restart: "no"`
- [x] Agregar healthcheck a `rustfs` para que el init espere a que esté listo.

## Variables de entorno

- [x] Agregar a `.env`:
  ```
  S3_ENDPOINT=http://localhost:9000
  S3_PUBLIC_URL=http://localhost:9000/products
  S3_BUCKET=products
  S3_ACCESS_KEY=...
  S3_SECRET_KEY=...
  ```
- [x] Ampliar el esquema zod de `src/const/index.ts` con esas variables y descomentar `DATABASE_URL`.
- [x] Confirmar que `.env` no está versionado (revisar `.gitignore`).

## Dependencia

- [x] `pnpm add @aws-sdk/client-s3`

## Criterio de salida

- [x] `docker compose up -d` deja `db`, `rustfs` sanos y `rustfs-init` terminado con código 0.
- [x] La consola en `http://localhost:9001` muestra el bucket `products`.
- [x] Un archivo subido a mano se abre sin credenciales en `S3_PUBLIC_URL/<archivo>`.
- [x] `pnpm dev` arranca sin errores de validación de env.
