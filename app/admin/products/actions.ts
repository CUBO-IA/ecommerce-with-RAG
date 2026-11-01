"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createProduct, deleteProduct } from "@/src/products";

type ProductState = { ok?: true; error?: string } | null;

export async function createProductAction(_prev: ProductState, formData: FormData): Promise<ProductState> {
  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) return { error: "Selecciona una imagen" };

  try {
    await createProduct({
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: String(formData.get("price") ?? "")
    }, image);
  } catch (err) {
    if (err instanceof z.ZodError) return { error: err.issues.map((i) => i.message).join(". ") };
    return { error: err instanceof Error ? err.message : "No se pudo crear el producto" };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function deleteProductAction(id: number) {
  await deleteProduct(z.number().int().positive().parse(id));
  revalidatePath("/");
  revalidatePath("/admin/products");
}
