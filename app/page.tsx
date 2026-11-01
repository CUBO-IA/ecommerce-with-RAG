import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { ProductCard } from "@/src/components/ProductCard";
import { listProducts } from "@/src/products";
import { formatPrice } from "@/src/products/format";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-8">
      <h1 className="mb-6 text-2xl font-semibold">Tienda</h1>
      <Suspense fallback={<p>Cargando productos...</p>}>
        <ProductGrid />
      </Suspense>
    </main>
  );
}

async function ProductGrid() {
  await connection();
  const products = await listProducts();

  if (products.length === 0) {
    return (
      <p>
        Aún no hay productos.{" "}
        <Link href="/admin/products" className="font-medium underline">Agregar un producto</Link>
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <Link key={p.id} href={`/product/${p.id}`} className="contents">
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
