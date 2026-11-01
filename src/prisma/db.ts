import 'temporal-polyfill/global';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import pgvector from '@prisma/orm-extension-pgvector/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

// ponytail: búsqueda por scan secuencial sobre embedding vector(2048); HNSW/IVFFlat no admiten >2000 dims. Subir con halfvec + HNSW, o usar un modelo de menos dimensiones.
export const contract = contractFromJson<Contract>(contractJson);

export const db = postgres({
  contract,
  url: process.env['DATABASE_URL'],
  extensions: [pgvector],
});
