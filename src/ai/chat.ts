import { type InferUITools, tool, type UIMessage } from "ai";
import { z } from "zod";
import { getProduct, searchProductsByMeaning, searchProductsByName } from "../products";
import { formatPrice } from "../products/format";

// Instrucciones base del asistente. Reglas de comportamiento de la tienda.
// Las técnicas de venta viven en SALES_GUIDE y se piden con getSalesGuide.
export const SYSTEM_PROMPT = `Eres un vendedor amable de una tienda en línea. Responde siempre en español y con respuestas cortas.
- Antes de recomendar productos o dar precios, busca con una de las dos herramientas de búsqueda: searchProductsByName si el cliente nombra un producto, marca o tipo exacto; searchProductsByMeaning si describe una necesidad o categoría general. Si la primera no devuelve nada útil, prueba la otra.
- No inventes productos, precios, stock ni características que no vengan de las herramientas.
- Si el cliente pone un límite de precio (p. ej. "menos de 20 dólares"), pasa minPrice o maxPrice a la búsqueda en vez de filtrar tú. Solo cuenta y menciona los productos que devuelva la herramienta; si devuelve 4, di 4.
- Si no hay resultados relevantes, dilo y ofrece hacer otra búsqueda.
- Los productos encontrados se muestran al cliente como tarjetas; no repitas sus datos en texto, solo di cuál encaja y por qué.
- Si el cliente quiere ver un producto en detalle (o dice "ese", "el primero", etc.), usa openProduct con su id: lo lleva a la página del producto. Después confirma en una frase.
- Si el cliente quiere comprar o añadir un producto al carrito, usa addToCart con su id y confirma en una frase.
- Si recibes un producto que el cliente está viendo, úsalo como contexto de la conversación ("este producto", "esto") sin volver a buscarlo.
- Si el cliente pregunta por su carrito (qué tiene, cuánto suma), usa viewCart y responde con lo que devuelva.
- Antes de recomendar, responder una objeción, saludar o cerrar una venta, usa getSalesGuide con el tema que corresponda y sigue su guía sin copiarla.
- Solo atiendes temas de la tienda (productos, precios, carrito, compra). Si pregunta cualquier otra cosa (ciencia, historia, cultura general, tareas, código, opiniones), no la respondas aunque sepas la respuesta: di en una frase que solo puedes ayudar con la tienda y ofrece buscar productos.
- Responde en texto plano, sin Markdown: nada de **negritas**, encabezados, listas con guiones ni tablas.`;

// Temas de venta que el asistente puede pedir bajo demanda con getSalesGuide.
const SALES_TOPICS = ["apertura", "calificar", "recomendar", "objeciones", "cierre"] as const;

// Guías cortas en texto plano. Se cargan solo cuando el modelo las pide,
// así no se gastan tokens en cada mensaje.
const SALES_GUIDE: Record<(typeof SALES_TOPICS)[number], string> = {
  apertura:
    "Saluda en una frase, di qué puedes hacer ahora y haz una sola pregunta: qué busca hoy. " +
    "Ejemplo: Hola, soy el asistente de la tienda. ¿Buscas algo en particular o quieres recomendaciones? " +
    "Evita frases vacías como 'bienvenido a nuestra increíble plataforma'.",

  calificar:
    "Antes de recomendar, haz una sola pregunta que cambie la recomendación: uso, presupuesto o necesidad. " +
    "Confirma su respuesta en pocas palabras. Nunca hagas varias preguntas en el mismo mensaje.",

  recomendar:
    "Recomienda un producto, no una lista. Explica qué resultado le da para su situación, no solo sus características. " +
    "Usa sus propias palabras. Da el precio tal como viene de la herramienta. " +
    "No inventes descuentos, plazos ni garantías.",

  objeciones:
    "Responde en una o dos frases y vuelve a un paso concreto. " +
    "Es caro: reenfoca en el resultado o en el costo por uso; si hay opciones más baratas, busca con maxPrice y ofrécelas. " +
    "No sé si me sirve: haz una pregunta sobre su uso y relaciónalo con el producto. " +
    "Lo voy a pensar: pregunta qué le falta para decidir; no presiones. " +
    "¿Es confiable?: usa solo datos de las herramientas; si no los hay, dilo. " +
    "¿Cuánto tarda el envío?: no tienes ese dato; di que el equipo de la tienda puede confirmarlo. " +
    "Quiere hablar con alguien: dile que no puedes atenderlo como asesor humano, sugiérele contactar al equipo de la tienda y deja de vender.",

  cierre:
    "Termina con un solo siguiente paso concreto: añadir al carrito (addToCart) o ver el producto (openProduct). " +
    "Usa un CTA o una pregunta por mensaje, nunca ambos. " +
    "Ejemplo: Si quieres, lo añado a tu carrito.",
};

type ProductRow = { id: number; name: string; description: string; priceCents: number; imageUrl: string };

// Convierte un producto de la base al formato que ve el modelo (precio ya formateado).
function toToolOutput({ id, name, description, priceCents, imageUrl }: ProductRow) {
  return { id, name, description, price: formatPrice(priceCents), imageUrl };
}

// Entrada común de las dos búsquedas. Los precios llegan en dólares.
const priceSearchSchema = z.object({
  query: z.string().trim().min(1).max(300),
  minPrice: z.number().nonnegative().max(1_000_000).optional(),
  maxPrice: z.number().nonnegative().max(1_000_000).optional(),
});

function toCents(minPrice?: number, maxPrice?: number) {
  return {
    minPriceCents: minPrice === undefined ? undefined : Math.round(minPrice * 100),
    maxPriceCents: maxPrice === undefined ? undefined : Math.round(maxPrice * 100),
  };
}

// Carrito que manda el cliente desde el navegador; se valida antes de usarlo.
export const cartSchema = z.array(z.object({ id: z.number().int().positive(), quantity: z.number().int().positive().max(999) })).max(100);

// Herramientas que el modelo puede llamar. Cada una describe cuándo usarla.
export const chatTools = {
  // Búsqueda por palabras exactas: nombre, marca o modelo que el cliente ya conoce.
  searchProductsByName: tool({
    description: "Busca productos por palabras del nombre o la descripción, como marca, modelo o tipo exacto (p. ej. 'licuadora Oster', 'cafetera de cápsulas'). Úsala cuando el cliente sabe lo que quiere. Precios opcionales en dólares, inclusivos.",
    inputSchema: priceSearchSchema,
    execute: async ({ query, minPrice, maxPrice }) => (await searchProductsByName(query, toCents(minPrice, maxPrice))).map(toToolOutput),
  }),

  // Búsqueda por significado: para necesidades o categorías genéricas.
  searchProductsByMeaning: tool({
    description: "Busca productos por significado, para necesidades o categorías generales (p. ej. 'cosas para la cocina', 'algo para cocinar rápido', 'electrodomésticos para el desayuno'). Úsala cuando el cliente describe lo que necesita sin nombrar un producto. Precios opcionales en dólares, inclusivos.",
    inputSchema: priceSearchSchema,
    execute: async ({ query, minPrice, maxPrice }) => (await searchProductsByMeaning(query, toCents(minPrice, maxPrice))).map(toToolOutput),
  }),

  // Abre la página de detalle. Devuelve null si el id no existe.
  openProduct: tool({
    description: "Lleva al cliente a la página de detalle de un producto por su id.",
    inputSchema: z.object({ id: z.number().int().positive() }),
    execute: async ({ id }) => {
      const product = await getProduct(id);
      return product ? toToolOutput(product) : null;
    },
  }),

  // Añade al carrito. Solo se usa cuando el cliente pide comprar.
  addToCart: tool({
    description: "Añade un producto al carrito del cliente por su id. Úsalo solo cuando el cliente pida comprarlo o añadirlo.",
    inputSchema: z.object({ id: z.number().int().positive() }),
    execute: async ({ id }) => {
      const product = await getProduct(id);
      return product ? { id: product.id, name: product.name, priceCents: product.priceCents, imageUrl: product.imageUrl } : null;
    },
  }),

  // Resume el carrito del cliente. Los datos llegan en context desde el navegador.
  viewCart: tool({
    description: "Devuelve los productos, cantidades y total del carrito del cliente. Úsalo cuando pregunte qué tiene en el carrito o cuánto suma.",
    inputSchema: z.object({}),
    contextSchema: z.object({ cart: cartSchema }),
    // ponytail: una consulta por producto; con carritos cortos basta.
    execute: async (_input, { context }) => {
      const items = (await Promise.all(context.cart.map(async ({ id, quantity }) => {
        const product = await getProduct(id);
        return product ? { name: product.name, quantity, unitCents: product.priceCents, lineCents: product.priceCents * quantity } : null;
      }))).filter((item) => item !== null);
      return {
        items: items.map(({ name, quantity, unitCents, lineCents }) => ({ name, quantity, unitPrice: formatPrice(unitCents), subtotal: formatPrice(lineCents) })),
        total: formatPrice(items.reduce((sum, i) => sum + i.lineCents, 0)),
      };
    },
  }),

  // Detalle de un producto por id, sin abrir la página.
  getProduct: tool({
    description: "Devuelve el detalle de un producto por su id.",
    inputSchema: z.object({ id: z.number().int().positive() }),
    execute: async ({ id }) => {
      const product = await getProduct(id);
      return product ? toToolOutput(product) : null;
    },
  }),

  // Guía de venta por tema (ver SALES_GUIDE).
  getSalesGuide: tool({
    description: "Devuelve una guía breve de ventas para un tema: apertura, calificar, recomendar, objeciones o cierre. Úsala antes de recomendar, responder una objeción o cerrar una venta.",
    inputSchema: z.object({ topic: z.enum(SALES_TOPICS) }),
    execute: async ({ topic }) => SALES_GUIDE[topic],
  }),
};

export type ChatMessage = UIMessage<never, never, InferUITools<typeof chatTools>>;
