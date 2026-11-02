# Development workflow

For initial environment setup, see [Getting started](./getting-started.md). See [Architecture](./architecture.md) for system boundaries and [Features](./features.md) for the product behavior covered by the application.

## Package commands

The current `package.json` exposes these scripts:

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Starts the Next.js development server. |
| `pnpm build` | Creates a production build. |
| `pnpm start` | Starts the production server after a successful build. |
| `pnpm lint` | Runs ESLint. |
| `pnpm test` | Runs the product search tests with `.env.local` loaded. |

The package declares `pnpm@12.6.0`. Its `postinstall` hook runs `prisma skills sync` and intentionally exits successfully if that command fails.

There are currently no `seed`, `migrate`, or `typecheck` scripts in `package.json`. Do not assume that `pnpm seed` or `pnpm migrate` is available.

## Environment and services

The local environment file defines these variable names:

- `DATABASE_URL` for the PostgreSQL connection used by product queries and tests.
- `ANTHROPIC_API_KEY` for the chat model.
- `OPENROUTER_API_KEY` for product embeddings.
- `S3_ENDPOINT`, `S3_PUBLIC_URL`, `S3_BUCKET`, `S3_ACCESS_KEY`, and `S3_SECRET_KEY` for product image storage and public URLs.

Keep the values local and never paste credentials into documentation. Product creation needs database, image storage, and embedding services; the seed workflow therefore depends on the corresponding local services and external access.

Docker Compose is the supported local path for the database and RustFS services. From the repository root, start them with:

```bash
docker compose --env-file .env.local up -d
```

Keep `--env-file .env.local` on Compose commands that need the local credentials. `docker compose --env-file .env.local down -v` deletes the local PostgreSQL and RustFS volumes.

## Tests and practical checks

`pnpm test` runs the two files listed by the package script:

- `src/products/lexical.test.mts` inserts temporary products and checks Spanish full-text matching and price filtering.
- `src/products/nearest.test.mts` inserts temporary 2048-dimensional vectors and checks nearest-neighbor ordering and price filtering.

Both suites create their fixtures in the database, remove them in teardown, and close the database connection. Run them against a disposable or otherwise safe development database with the required schema and vector support available through `DATABASE_URL`.

For a routine change, run `pnpm lint`, then `pnpm test` when database-backed product search is affected, and `pnpm build` for application or route changes. With products present in the catalog, use `pnpm dev` to manually check the chat route and widget: search by an exact product name, search by a general need, open a result, add a result to the cart, and ask for the cart total. The current package scripts do not include an automated chat UI or route test.

## Migrations

Migration sources are under separate directories:

- `migrations/pgvector/20260601T0000_install_vector_extension/` records installation of the vector extension.
- `migrations/app/20261101T1648_init/` creates the initial `public.Document` table with a `vector(2048)` embedding.
- `migrations/app/20261101T1712_products/` drops `Document` and creates `public.Product` with `name`, `description`, `priceCents`, `imageKey`, `embedding vector(2048)`, and `createdAt`.

The two `migrations/app/*/migration.ts` files are executable TypeScript migration definitions and call `MigrationCLI.run`; the pgvector migration is represented by its `migration.json` and `ops.json` artifacts. `prisma.config.ts` points the Prisma CLI at `DATABASE_URL` and the `migrations` directory. Apply pending migrations with:

```bash
pnpm exec prisma db migrate --db "$DATABASE_URL"
```

Run this from a shell where `DATABASE_URL` is exported. To check the live database against the contract without applying migrations, run:

```bash
pnpm exec prisma db verify --db "$DATABASE_URL"
```

These commands are not package scripts; they use the checked-in Prisma 8 CLI configuration.

## Sample catalog dump

[`database/sample.sql`](../database/sample.sql) is a checked-in data-only dump of 30 `Product` rows. It was created with `pg_dump --data-only --table='public."Product"' --no-owner --no-privileges`; do not add `--sequence-data`, which the PostgreSQL 17 `pg_dump` used by the Compose database image rejects because `--data-only` includes sequence values.

After applying migrations, restore it through the Compose database service:

```bash
docker compose --env-file .env.local exec -T db psql -U postgres -d app < database/sample.sql
```

The dump includes 30 `imageKey` references but no RustFS objects. Restoring it alone does not upload those objects; if matching objects are not already in the local RustFS bucket, the imported catalog can be listed while its product images are unavailable until matching objects are uploaded. Use it with a fresh migrated local database; importing again into a non-empty database may conflict on product IDs. Do not truncate or remove data unless an intentional reset is explicitly required.

## Seed and catalog data

The catalog data workflow is `scripts/seed.mts`. It contains the fixed product list and image identifiers, downloads product images from Unsplash, creates missing products, and generates embeddings through the normal product creation path. It is not a package script, and the repository does not install `tsx` or `ts-node` for it; use `/admin/products` for the supported UI path to add individual local products.

The script is destructive outside that fixed list: it deletes every existing product whose name is not listed, and also deletes duplicate rows for a listed name after keeping one. Treat it as a reset/reconciliation operation and do not run it against data that must be preserved. It is not exposed as a package script.

The script retries any failed product creation after 65 seconds; its source comment identifies the free embedding service's limit as the reason for this delay. Image downloads and embedding generation also mean that a seed run requires network access and the relevant external credentials.
