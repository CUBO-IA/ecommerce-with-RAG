"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/src/cart/CartProvider";
import { formatPrice } from "@/src/products/format";

export default function CartPage() {
  const { items, ready, totalCents, setQuantity, remove, clear } = useCart();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-8 sm:py-10">
      <Link href="/" className="mb-6 inline-block text-sm font-bold text-navy underline">← Seguir comprando</Link>
      <h1 className="mb-6 font-heading text-3xl font-bold text-charcoal uppercase">Tu carrito</h1>

      {!ready ? (
        <p className="text-muted">Cargando carrito...</p>
      ) : items.length === 0 ? (
        <p className="text-charcoal">Tu carrito está vacío.</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="flex flex-col divide-y divide-mist">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <Image src={item.imageUrl} alt={item.name} width={96} height={96} unoptimized className="size-24 shrink-0 bg-mist-soft object-cover" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Link href={`/product/${item.id}`} className="truncate font-bold text-charcoal hover:underline">{item.name}</Link>
                  <p className="text-sm text-muted">{formatPrice(item.priceCents)} c/u</p>
                  <div className="flex items-center gap-3">
                    <button type="button" aria-label="Disminuir cantidad" onClick={() => setQuantity(item.id, item.quantity - 1)} className="size-8 cursor-pointer border border-mist font-bold text-charcoal">−</button>
                    <span className="min-w-6 text-center font-bold text-charcoal">{item.quantity}</span>
                    <button type="button" aria-label="Aumentar cantidad" onClick={() => setQuantity(item.id, item.quantity + 1)} className="size-8 cursor-pointer border border-mist font-bold text-charcoal">+</button>
                    <button type="button" onClick={() => remove(item.id)} className="cursor-pointer text-sm font-bold text-navy underline">
                      Eliminar
                    </button>
                  </div>
                </div>
                <p className="shrink-0 font-bold text-charcoal">{formatPrice(item.priceCents * item.quantity)}</p>
              </li>
            ))}
          </ul>

          <aside className="flex h-fit flex-col gap-4 bg-mist-soft p-6">
            <p className="flex justify-between font-bold text-charcoal">
              <span>Total</span>
              <span>{formatPrice(totalCents)}</span>
            </p>
            <button type="button" className="cursor-pointer rounded-full bg-promo py-3 font-bold text-white">
              Continuar compra
            </button>
            <button type="button" onClick={clear} className="cursor-pointer text-sm font-bold text-navy underline">
              Vaciar carrito
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
