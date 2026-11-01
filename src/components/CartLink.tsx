"use client";

import Link from "next/link";
import { useCart } from "@/src/cart/CartProvider";

export function CartLink() {
  const { count } = useCart();

  return (
    <Link href="/cart" aria-label={`Carrito (${count})`} title="Carrito" className="relative shrink-0 rounded-sm text-2xl focus-visible:outline-2 focus-visible:outline-white">
      🛒
      {count > 0 && (
        <span className="absolute -top-2 -right-2 flex min-w-5 items-center justify-center rounded-full bg-promo px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
