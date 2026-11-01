// ponytail: /admin/products sin autenticación, solo PoC. Agregar auth antes de cualquier uso real.
import Image from "next/image";
import { connection } from "next/server";
import { Suspense } from "react";
import { listProducts } from "@/src/products";
import { deleteProductAction } from "./actions";
import { ProductForm } from "./product-form";

export default function AdminProductsPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 p-8">
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Nuevo producto</h1>
        <ProductForm />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Productos</h2>
        <Suspense fallback={<p>Cargando productos...</p>}>
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
      <p>Aún no hay productos.</p>
    ) : (
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Imagen</th>
            <th className="py-2">Nombre</th>
            <th className="py-2">Precio</th>
            <th className="py-2"><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="py-2">
                <Image src={p.imageUrl} alt={p.name} width={64} height={64} unoptimized className="h-16 w-16 object-cover" />
              </td>
              <td className="py-2">{p.name}</td>
              <td className="py-2">{(p.priceCents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
              <td className="py-2">
                <form action={deleteProductAction.bind(null, p.id)}>
                  <button type="submit" aria-label={`Borrar ${p.name}`} className="text-red-600 hover:underline">Borrar</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  );
}
