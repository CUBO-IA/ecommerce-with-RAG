"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/src/ai/chat";
import { readStorage, useCart } from "@/src/cart/CartProvider";
import { ProductCard } from "./ProductCard";

const transport = new DefaultChatTransport<ChatMessage>({
  api: "/api/chat",
  body: () => ({
    path: window.location.pathname,
    cart: readStorage().map(({ id, quantity }) => ({ id, quantity })),
  }),
});

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat<ChatMessage>({ transport });
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const handled = useRef(new Set<string>());
  const { add } = useCart();
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    for (const m of messages) {
      for (const part of m.parts) {
        if (part.type === "tool-openProduct" && part.state === "output-available" && part.output && !handled.current.has(part.toolCallId)) {
          handled.current.add(part.toolCallId);
          router.push(`/product/${part.output.id}`);
        }
        if (part.type === "tool-addToCart" && part.state === "output-available" && part.output && !handled.current.has(part.toolCallId)) {
          handled.current.add(part.toolCallId);
          add(part.output);
        }
      }
    }
  }, [messages, router, add]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
  }

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") close();
  }

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="Asistente de compras"
          onKeyDown={onKeyDown}
          className="fixed right-4 bottom-24 z-50 flex h-[32rem] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden bg-white text-ink shadow-xl"
        >
          <header className="bg-header p-3 font-heading text-base font-bold text-white uppercase">Asistente de compras</header>
          <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
            {messages.length === 0 && <p className="text-sm text-muted">¡Hola! Cuéntame qué buscas y te ayudo a elegir.</p>}
            {messages.map((m) => {
              const shown = new Set<number>();
              const card = (p: { id: number; name: string; description: string; price: string; imageUrl: string }) => {
                if (shown.has(p.id)) return null;
                shown.add(p.id);
                return (
                  <Link key={p.id} href={`/product/${p.id}`} className="block hover:opacity-80">
                    <ProductCard compact name={p.name} description={p.description} price={p.price} imageUrl={p.imageUrl} />
                  </Link>
                );
              };
              return (
                <div key={m.id} className={m.role === "user" ? "self-end rounded-full bg-promo px-4 py-2 text-sm font-bold text-white" : "flex flex-col gap-2 text-sm text-charcoal"}>
                  {m.parts.map((part, i) => {
                    if (part.type === "text") return <p key={i} className="whitespace-pre-wrap">{part.text}</p>;
                    if ((part.type === "tool-searchProductsByName" || part.type === "tool-searchProductsByMeaning") && part.state === "output-available") {
                      return <div key={i} className="flex flex-col gap-2">{part.output.map(card)}</div>;
                    }
                    if ((part.type === "tool-getProduct" || part.type === "tool-openProduct") && part.state === "output-available" && part.output) return card(part.output);
                    return null;
                  })}
                </div>
              );
            })}
            {busy && <p className="text-sm text-muted" role="status">Escribiendo…</p>}
            {error && <p role="alert" className="text-sm font-bold text-promo">No pude responder en este momento. Intenta de nuevo.</p>}
          </div>
          <form onSubmit={submit} className="flex gap-2 border-t border-line p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta"
              aria-label="Mensaje"
              className="min-w-0 flex-1 rounded-full border border-line px-4 py-2 text-sm outline-none focus:border-navy"
            />
            <button type="submit" disabled={busy || !input.trim()} className="rounded-full bg-promo px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
              Enviar
            </button>
          </form>
        </section>
      )}
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Cerrar asistente de compras" : "Abrir asistente de compras"}
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
        className="fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full bg-promo text-2xl text-white shadow-lg"
      >
        {open ? "×" : "💬"}
      </button>
    </>
  );
}
