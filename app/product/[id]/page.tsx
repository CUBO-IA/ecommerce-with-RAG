import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { getProduct } from "@/src/products";
import { formatPrice } from "@/src/products/format";

export default function ProductPage({ params }: PageProps<"/product/[id]">) {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 p-4 sm:p-8">
      <Link href="/" className="mb-6 inline-block text-sm underline">← Volver a la tienda</Link>
      <Suspense fallback={<p>Cargando producto...</p>}>
        <Detail params={params} />
      </Suspense>
    </main>
  );
}

async function Detail({ params }: { params: PageProps<"/product/[id]">["params"] }) {
  await connection();
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const product = await getProduct(Number(id));
  if (!product) notFound();

  return (
    <article className="grid gap-6 sm:grid-cols-2">
      <Image src={product.imageUrl} alt={product.name} width={800} height={800} unoptimized className="aspect-square w-full rounded-lg object-cover" />
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-xl font-medium">{formatPrice(product.priceCents)}</p>
        <p className="whitespace-pre-wrap text-zinc-700">{product.description}</p>
      </div>
    </article>
  );
}
