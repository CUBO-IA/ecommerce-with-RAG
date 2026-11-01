import Link from "next/link";
import { CartLink } from "@/src/components/CartLink";

// ponytail: categorías de muestra; el modelo de datos aún no tiene categorías. Buscador y carrito solo visuales.
const categories = ["Tecnología", "Hogar", "Cocina", "Moda", "Herramientas", "Deportes"];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-promo px-4 py-1.5 text-center text-xs font-bold tracking-wide text-white uppercase">
        Ofertas de temporada en toda la tienda
      </div>
      <div className="bg-header text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-white">
            <span className="flex size-9 rotate-45 items-center justify-center bg-white">
              <span className="-rotate-45 font-heading text-xl font-bold text-header">S</span>
            </span>
            <span className="hidden font-heading text-lg font-bold uppercase sm:inline">Mini tienda</span>
          </Link>
          <label className="flex min-w-0 flex-1 items-center rounded-full bg-white px-4 py-2 text-ink">
            <span className="sr-only">Buscar</span>
            <input type="search" placeholder="Buscar" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted" />
          </label>
          <CartLink />
        </div>
        <nav aria-label="Categorías" className="border-t border-white/20">
          <ul className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-2.5 whitespace-nowrap sm:px-8">
            {categories.map((c) => (
              <li key={c}>
                <Link href="/" className="rounded-sm text-sm font-bold focus-visible:outline-2 focus-visible:outline-white">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
