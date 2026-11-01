"use client";

import { useState } from "react";
import { type CartProduct, useCart } from "@/src/cart/CartProvider";

export function AddToCartButton({ product }: { product: CartProduct }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-fit cursor-pointer rounded-full bg-promo px-6 py-3 text-base font-bold text-white"
    >
      {added ? "¡Añadido al carrito!" : "Añadir al carrito"}
    </button>
  );
}
