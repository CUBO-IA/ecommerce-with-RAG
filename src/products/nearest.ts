import { db } from "../prisma/db.ts";

const MAX_PRICE_CENTS = 2_147_483_647;

export function nearestProducts(vector: number[], limit: number, { minPriceCents = 0, maxPriceCents = MAX_PRICE_CENTS } = {}) {
  return db.orm.public.Product
    .select("id", "name", "description", "priceCents", "imageKey")
    .where((p) => p.priceCents.gte(minPriceCents))
    .where((p) => p.priceCents.lte(maxPriceCents))
    .using.embedding_nearest(vector)
    .limit(limit)
    .all();
}
