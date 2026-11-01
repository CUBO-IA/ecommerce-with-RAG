import { db } from "../prisma/db.ts";

const MAX_PRICE_CENTS = 2_147_483_647;

export function lexicalProducts(query: string, limit: number, { minPriceCents = 0, maxPriceCents = MAX_PRICE_CENTS } = {}) {
  return db.orm.public.Product
    .select("id", "name", "description", "priceCents", "imageKey")
    .where((p, { fns }) => fns.raw`to_tsvector('spanish', ${p.name} || ' ' || ${p.description}) @@ websearch_to_tsquery('spanish', ${query})`.returns("pg/bool@1"))
    .where((p) => p.priceCents.gte(minPriceCents))
    .where((p) => p.priceCents.lte(maxPriceCents))
    .orderBy((p, { fns }) => fns.raw`ts_rank(to_tsvector('spanish', ${p.name} || ' ' || ${p.description}), websearch_to_tsquery('spanish', ${query}))`.returns("pg/float4@1").desc())
    .limit(limit)
    .all();
}
