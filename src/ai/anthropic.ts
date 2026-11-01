import { createAnthropic } from "@ai-sdk/anthropic";
import { env } from "../const";

export const CHAT_MODEL = "claude-haiku-5-5";

export const anthropic = createAnthropic({
  apiKey: env.ANTHROPIC_API_KEY
});

export const haiku = anthropic(CHAT_MODEL);
