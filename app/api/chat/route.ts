import { convertToModelMessages, createUIMessageStreamResponse, isStepCount, streamText, toUIMessageStream, validateUIMessages } from "ai";
import { z } from "zod";
import { getProduct } from "@/src/products";
import { formatPrice } from "@/src/products/format";
import { haiku } from "@/src/ai/anthropic";
import { type ChatMessage, chatTools, SYSTEM_PROMPT } from "@/src/ai/chat";

export const maxDuration = 60;

const bodySchema = z.object({ messages: z.array(z.unknown()).min(1), path: z.string().max(200).optional() });

const invalid = () => Response.json({ error: "Historial inválido" }, { status: 400 });

export async function POST(req: Request) {
  const body = bodySchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return invalid();

  let messages: ChatMessage[];
  try {
    messages = await validateUIMessages<ChatMessage>({ messages: body.data.messages, tools: chatTools });
  } catch {
    return invalid();
  }

  const viewedId = body.data.path?.match(/^\/product\/(\d+)$/)?.[1];
  const viewed = viewedId ? await getProduct(Number(viewedId)) : null;
  const context = viewed
    ? `\n\nEl cliente está viendo ahora la página del producto id ${viewed.id}: "${viewed.name}", ${formatPrice(viewed.priceCents)}. Descripción: ${viewed.description}`
    : body.data.path === "/" ? "\n\nEl cliente está viendo el catálogo." : "";

  const result = streamText({
    model: haiku,
    instructions: SYSTEM_PROMPT + context,
    messages: await convertToModelMessages(messages, { tools: chatTools }),
    tools: chatTools,
    stopWhen: isStepCount(4),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      tools: chatTools,
      onError: (error) => {
        console.error("chat error", error);
        return "No pude responder en este momento. Intenta de nuevo en unos segundos.";
      },
    }),
  });
}
