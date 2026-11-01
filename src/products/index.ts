import { z } from "zod";
import { embed } from "../ai/openrouter";
import { db } from "../prisma/db";
import { deleteImage, IMAGE_EXTENSIONS, imageUrl, uploadImage } from "../s3/client";
import { nearestProducts } from "./nearest";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const productInput = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120, "El nombre supera 120 caracteres"),
  description: z.string().trim().min(1, "La descripción es obligatoria").max(2000, "La descripción supera 2000 caracteres"),
  price: z.coerce.number("El precio debe ser un número").positive("El precio debe ser mayor que 0")
}).transform(({ price, ...rest }) => ({ ...rest, priceCents: Math.round(price * 100) }));

export type ProductInput = z.input<typeof productInput>;

const columns = ["id", "name", "description", "priceCents", "imageKey"] as const;

function toPublic<T extends { imageKey: string }>({ imageKey, ...product }: T) {
  return { ...product, imageUrl: imageUrl(imageKey) };
}

export async function createProduct(raw: ProductInput, file: File) {
  const input = productInput.parse(raw);
  if (!Object.hasOwn(IMAGE_EXTENSIONS, file.type)) throw new Error("La imagen debe ser JPEG, PNG o WebP");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("La imagen supera 5 MB");

  const imageKey = await uploadImage(file);
  try {
    const embedding = await embed(`${input.name}\n${input.description}`);
    const row = await db.orm.public.Product
      .select(...columns)
      .create({ ...input, imageKey, embedding });
    return toPublic(row);
  } catch (err) {
    await deleteImage(imageKey);
    throw err;
  }
}

export async function listProducts() {
  const rows = await db.orm.public.Product
    .select(...columns)
    .orderBy((p) => p.createdAt.desc())
    .all();
  return rows.map(toPublic);
}

export async function getProduct(id: number) {
  const row = await db.orm.public.Product.select(...columns).first({ id });
  return row && toPublic(row);
}

export async function deleteProduct(id: number): Promise<boolean> {
  const row = await db.orm.public.Product.select("imageKey").first({ id });
  if (!row) return false;

  await db.orm.public.Product.where({ id }).delete();
  await deleteImage(row.imageKey);
  return true;
}

export async function searchProducts(query: string, { limit = 5, minPriceCents, maxPriceCents }: { limit?: number; minPriceCents?: number; maxPriceCents?: number } = {}) {
  const vector = await embed(query);
  // ponytail: búsqueda por scan secuencial sobre embedding vector(2048); HNSW/IVFFlat no admiten >2000 dims. Subir con halfvec + HNSW, o usar un modelo de menos dimensiones.
  const rows = await nearestProducts(vector, limit, { minPriceCents, maxPriceCents });
  return rows.map(toPublic);
}
