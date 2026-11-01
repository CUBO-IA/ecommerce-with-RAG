import Link from "next/link";
import { CartLink } from "@/src/components/CartLink";

// ponytail: categorías de muestra; el modelo de datos aún no tiene categorías. Buscador y carrito solo visuales.
const categories = ["Tecnología", "Hogar", "Cocina", "Moda", "Herramientas", "Deportes"];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-header text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-8">
          <Link href="/" className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-white">
            <span className="font-heading text-lg font-bold tracking-wide uppercase">Mini tienda</span>
          </Link>
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-ink shadow-inner ring-2 ring-transparent transition focus-within:ring-white/60">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
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
