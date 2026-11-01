import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { ProductCard } from "@/src/components/ProductCard";
import { listProducts } from "@/src/products";
import { formatPrice } from "@/src/products/format";

export default function Home() {
  return (
    <>
      <section className="bg-promo text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-12 sm:px-8 sm:py-20">
          <p className="text-sm font-bold tracking-wide uppercase">Campaña de temporada</p>
          <h1 className="max-w-3xl font-heading text-4xl leading-none font-bold uppercase sm:text-6xl">
            Ofertas que renuevan tu hogar
          </h1>
        </div>
      </section>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8">
        <h2 className="mb-6 font-heading text-2xl font-bold text-charcoal">Lo último para tu hogar</h2>
        <Suspense fallback={<p className="text-muted">Cargando productos...</p>}>
          <ProductGrid />
        </Suspense>
      </main>
    </>
  );
}

async function ProductGrid() {
  await connection();
  const products = await listProducts();

  if (products.length === 0) {
    return (
      <p className="text-charcoal">
        Aún no hay productos.{" "}
        <Link href="/admin/products" className="font-bold text-navy underline">Agregar un producto</Link>
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {products.map((p) => (
        <Link key={p.id} href={`/product/${p.id}`} className="flex flex-col">
          <ProductCard
            name={p.name}
            description={p.description}
            price={formatPrice(p.priceCents)}
            imageUrl={p.imageUrl}
          />
        </Link>
      ))}
    </div>
  );
}
