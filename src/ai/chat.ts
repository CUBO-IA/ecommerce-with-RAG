import { type InferUITools, tool, type UIMessage } from "ai";
import { z } from "zod";
import { getProduct, searchProducts } from "../products";
import { formatPrice } from "../products/format";

export const SYSTEM_PROMPT = `Eres un vendedor amable de una tienda en línea. Responde siempre en español y con respuestas cortas.
- Usa searchProducts antes de recomendar productos o dar precios.
- No inventes productos, precios, stock ni características que no vengan de las herramientas.
- Si el cliente pone un límite de precio (p. ej. "menos de 20 dólares"), pasa minPrice o maxPrice a searchProducts en vez de filtrar tú. Solo cuenta y menciona los productos que devuelva la herramienta; si devuelve 4, di 4.
- Si no hay resultados relevantes, dilo y ofrece hacer otra búsqueda.
- Los productos encontrados se muestran al cliente como tarjetas; no repitas sus datos en texto, solo di cuál encaja y por qué.
- Si el cliente quiere ver un producto en detalle (o dice "ese", "el primero", etc.), usa openProduct con su id: lo lleva a la página del producto. Después confirma en una frase.
- Si el cliente quiere comprar o añadir un producto al carrito, usa addToCart con su id y confirma en una frase.
- Si recibes un producto que el cliente está viendo, úsalo como contexto de la conversación ("este producto", "esto") sin volver a buscarlo.
- Responde en texto plano, sin Markdown: nada de **negritas**, encabezados, listas con guiones ni tablas.`;

type ProductRow = { id: number; name: string; description: string; priceCents: number; imageUrl: string };

function toToolOutput({ id, name, description, priceCents, imageUrl }: ProductRow) {
  return { id, name, description, price: formatPrice(priceCents), imageUrl };
}

export const chatTools = {
  searchProducts: tool({
    description: "Busca productos del catálogo por descripción en lenguaje natural. Precios opcionales en dólares, inclusivos.",
    inputSchema: z.object({
      query: z.string().trim().min(1).max(300),
      minPrice: z.number().nonnegative().max(1_000_000).optional(),
      maxPrice: z.number().nonnegative().max(1_000_000).optional(),
    }),
    execute: async ({ query, minPrice, maxPrice }) =>
      (await searchProducts(query, {
        minPriceCents: minPrice === undefined ? undefined : Math.round(minPrice * 100),
        maxPriceCents: maxPrice === undefined ? undefined : Math.round(maxPrice * 100),
      })).map(toToolOutput),
  }),
  openProduct: tool({
    description: "Lleva al cliente a la página de detalle de un producto por su id.",
    inputSchema: z.object({ id: z.number().int().positive() }),
    execute: async ({ id }) => {
      const product = await getProduct(id);
      return product ? toToolOutput(product) : null;
    },
  }),
  addToCart: tool({
    description: "Añade un producto al carrito del cliente por su id. Úsalo solo cuando el cliente pida comprarlo o añadirlo.",
    inputSchema: z.object({ id: z.number().int().positive() }),
    execute: async ({ id }) => {
      const product = await getProduct(id);
      return product ? { id: product.id, name: product.name, priceCents: product.priceCents, imageUrl: product.imageUrl } : null;
    },
  }),
  getProduct: tool({
    description: "Devuelve el detalle de un producto por su id.",
    inputSchema: z.object({ id: z.number().int().positive() }),
    execute: async ({ id }) => {
      const product = await getProduct(id);
      return product ? toToolOutput(product) : null;
    },
  }),
};

export type ChatMessage = UIMessage<never, never, InferUITools<typeof chatTools>>;
