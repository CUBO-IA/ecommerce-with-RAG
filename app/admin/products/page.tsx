// ponytail: /admin/products sin autenticación, solo PoC. Agregar auth antes de cualquier uso real.
import Image from "next/image";
import { connection } from "next/server";
import { Suspense } from "react";
import { listProducts } from "@/src/products";
import { deleteProductAction } from "./actions";
import { ProductForm } from "./product-form";

export default function AdminProductsPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 p-8 text-charcoal">
      <section className="flex flex-col gap-4">
        <h1 className="font-heading text-3xl font-bold uppercase">Nuevo producto</h1>
        <ProductForm />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-2xl font-bold uppercase">Productos</h2>
        <Suspense fallback={<p className="text-muted">Cargando productos...</p>}>
          <ProductList />
        </Suspense>
      </section>
    </main>
  );
}

async function ProductList() {
  await connection();
  const products = await listProducts();

  return (
    products.length === 0 ? (
      <p className="text-muted">Aún no hay productos.</p>
    ) : (
      <table className="w-full text-left text-sm">
        <thead className="bg-mist text-muted">
          <tr>
            <th className="px-3 py-2 font-bold">Imagen</th>
            <th className="px-3 py-2 font-bold">Nombre</th>
            <th className="px-3 py-2 font-bold">Precio</th>
            <th className="px-3 py-2"><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t border-line">
              <td className="px-3 py-2">
                <Image src={p.imageUrl} alt={p.name} width={64} height={64} unoptimized className="size-16 bg-mist object-cover" />
              </td>
              <td className="px-3 py-2 font-bold">{p.name}</td>
              <td className="px-3 py-2">{(p.priceCents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
              <td className="px-3 py-2">
                <form action={deleteProductAction.bind(null, p.id)}>
                  <button type="submit" aria-label={`Borrar ${p.name}`} className="font-bold text-promo hover:underline">Borrar</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  );
}
