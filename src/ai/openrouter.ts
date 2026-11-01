import { OpenRouter } from "@openrouter/sdk";
import { env } from "../const";

export const EMBEDDING_MODEL = "nvidia/nemotron-3.5-embed-1b:free";

export const openrouter = new OpenRouter({
  apiKey: env.OPENROUTER_API_KEY
});

export async function embed(input: string): Promise<number[]> {
  const res = await openrouter.embeddings.generate({
    requestBody: {
      model: EMBEDDING_MODEL,
      input,
      encodingFormat: "float"
    }
  });

  if (typeof res === "string") throw new Error(`Respuesta de embeddings inválida: ${res}`);

  const vector = res.data[0].embedding;
  if (typeof vector === "string") throw new Error("Embedding en base64 no soportado; usa encodingFormat float");

  return vector;
}
