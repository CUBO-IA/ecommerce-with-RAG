# Getting started

This guide describes the supported local workflow for Mini tienda: install the dependencies, use Docker Compose for PostgreSQL and RustFS, apply the checked-in migrations, and run the application checks.

## Prerequisites

- Node.js `>=20.9.0` (the version range required by the checked-in Next.js package).
- pnpm `12.6.0`, as declared by `package.json`.
- Docker with the `docker compose` plugin.
- An OpenRouter API key and an Anthropic API key for a full application run. Both AI variables are required by the current environment schema; there are no optional AI credentials in this setup.

## Install dependencies

From the repository root, run:

```bash
pnpm install
```

The `postinstall` script attempts to synchronize Prisma agent skills and intentionally exits successfully if that sync is unavailable.

## Configure `.env.local`

Create `.env.local` in the repository root. The repository ignores `.env*` files; never commit this file or copy credentials into documentation, logs, or issue reports. Use the following shape, replace the API-key placeholders with your own credentials, and choose local-only values for the S3 placeholders:

```dotenv
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app"
OPENROUTER_API_KEY="replace-with-your-openrouter-key"
ANTHROPIC_API_KEY="replace-with-your-anthropic-key"
S3_ENDPOINT="http://localhost:9000"
S3_PUBLIC_URL="http://localhost:9000/products"
S3_BUCKET="products"
S3_ACCESS_KEY="choose-a-local-only-access-key"
S3_SECRET_KEY="choose-a-local-only-secret-key"
```

The application validates these names at startup:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection used by the application and Prisma commands. |
| `OPENROUTER_API_KEY` | Yes (AI) | Generates product embeddings when products are created and for meaning-based search. |
| `ANTHROPIC_API_KEY` | Yes (AI) | Powers the AI shopping assistant at `/api/chat`. |
| `S3_ENDPOINT` | Yes | S3-compatible API endpoint for image uploads. |
| `S3_PUBLIC_URL` | Yes | Public base URL used to display uploaded product images. |
| `S3_BUCKET` | Yes | Object-storage bucket for product images; the bundled setup uses `products`. |
| `S3_ACCESS_KEY` | Yes | Local RustFS access key, also used by Docker Compose. |
| `S3_SECRET_KEY` | Yes | Local RustFS secret key, also used by Docker Compose. |
| `NODE_ENV` | No | Defaults to `development` when omitted. |

Both AI variables are required even when using a feature that needs only one provider: the shared environment schema does not make either one optional. A real OpenRouter key is needed before creating products because creation generates an embedding; the Anthropic key is needed for chat. Use local-only S3 values and never reuse production credentials.

## Start local services

Start PostgreSQL, RustFS, and the one-shot RustFS bucket initializer:

```bash
docker compose --env-file .env.local up -d
docker compose --env-file .env.local ps --all
```

The services are:

- `db`: `pgvector/pgvector:pg17`, available at `localhost:5432`. Compose creates database `app` with user and password `postgres`, matching the example `DATABASE_URL`.
- `rustfs`: S3 API at `localhost:9000` and the RustFS console at `localhost:9001`.
- `rustfs-init`: waits for RustFS health, creates the `products` bucket, and grants anonymous `GetObject` access. It should finish with exit code `0`, not remain running.

Docker Compose does not load `.env.local` by default, so keep `--env-file .env.local` on Compose commands that need these values. The compose file stores database and object-storage data in the `pgdata` and `rustfsdata` named volumes. `docker compose --env-file .env.local down -v` removes those volumes and deletes the local data.

## Apply the database migrations

The checked-in Prisma configuration reads `DATABASE_URL` and uses the `migrations` directory. Prisma does not automatically load `.env.local` through the imported `dotenv/config`, so export the local database URL before running the CLI (the value below matches the bundled Compose database):

```bash
export DATABASE_URL='postgresql://postgres:postgres@localhost:5432/app'
pnpm exec prisma db migrate --db "$DATABASE_URL"
```

The migration set enables the `vector` extension and creates the `Product` table. To verify the live database against the contract:

```bash
pnpm exec prisma db verify --db "$DATABASE_URL"
```

## Restore the sample catalog

The checked-in [`database/sample.sql`](../database/sample.sql) contains 30 `Product` rows, including their catalog fields, embeddings, IDs, and `imageKey` references. It was created with `pg_dump --data-only --table='public."Product"' --no-owner --no-privileges`. Do not add `--sequence-data`: the PostgreSQL 17 `pg_dump` used by the Compose database image rejects that option, and `--data-only` includes the sequence values.

Apply migrations before restoring the dump. On a fresh migrated local database, run:

```bash
docker compose --env-file .env.local exec -T db psql -U postgres -d app < database/sample.sql
```

The dump contains PostgreSQL data only; it does not include RustFS objects. It has 30 `imageKey` references, but restoring the SQL alone does not upload those objects. If matching objects are not already in the local RustFS bucket, imported products can appear in the storefront while their images are missing until the corresponding objects are uploaded. Re-importing into a non-empty database may conflict with the dump's product IDs; do not treat this as a merge operation. Do not delete or truncate local data unless that reset is intentional. `docker compose --env-file .env.local down -v` deletes both the local PostgreSQL and RustFS volumes.

## Run the application

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). A fresh database has no catalog items. Use [http://localhost:3000/admin/products](http://localhost:3000/admin/products) to add a product with a name, description, positive price, and a JPEG, PNG, or WebP image no larger than 5 MB. The form uploads the image to RustFS and generates its embedding through OpenRouter. This admin route has no authentication, so use it only in a local or otherwise protected environment.

Useful local URLs:

- Storefront: [http://localhost:3000](http://localhost:3000)
- Product administration: [http://localhost:3000/admin/products](http://localhost:3000/admin/products)
- Cart: [http://localhost:3000/cart](http://localhost:3000/cart)
- RustFS console: [http://localhost:9001](http://localhost:9001)

The cart is browser-local and the checkout button is not connected to a checkout flow.

The repository also contains `scripts/seed.mts`, which synchronizes a fixed demo catalog and downloads its images. It is not registered as a `package.json` script, and the repository does not install `tsx` or `ts-node`, so this guide does not invent a seed command. Use the product-administration page for the supported setup path; note that the seed script deletes products outside its fixed catalog if it is run with a separately configured TypeScript runner.

## Available package scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Next.js development server. |
| `pnpm build` | Create a production build. |
| `pnpm start` | Start the production server after a successful build. |
| `pnpm lint` | Run ESLint. |
| `pnpm test` | Run the two configured Node test files with `.env.local`. The tests insert and remove temporary rows in `DATABASE_URL`, so use the local database. |

## Verification checklist

After configuring the environment, starting Docker, and exporting `DATABASE_URL`, run:

```bash
docker compose --env-file .env.local ps --all
pnpm exec prisma db verify --db "$DATABASE_URL"
pnpm lint
pnpm test
pnpm build
```

Then run `pnpm dev`, open the storefront, add a product through `/admin/products`, and confirm that it appears on the home page with its image. Test the AI assistant only after both AI credentials are configured.

[Back to the project overview](../README.md)
