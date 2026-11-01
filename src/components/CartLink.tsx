"use client";

import Link from "next/link";
import { useCart } from "@/src/cart/CartProvider";

export function CartLink() {
  const { count } = useCart();

  return (
    <Link href="/cart" aria-label={`Carrito (${count})`} title="Carrito" className="relative flex size-11 shrink-0 items-center justify-center rounded-full text-2xl transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white">
      🛒
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-full bg-promo px-1 text-xs font-bold text-white ring-2 ring-header">
          {count}
        </span>
      )}
    </Link>
  );
}
