import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { AddToCartButton } from "@/src/components/AddToCartButton";
import { getProduct } from "@/src/products";
import { formatPrice } from "@/src/products/format";

export default function ProductPage({ params }: PageProps<"/product/[id]">) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-8 sm:py-10">
      <Link href="/" className="mb-6 inline-block text-sm font-bold text-navy underline">← Volver a la tienda</Link>
      <Suspense fallback={<p className="text-muted">Cargando producto...</p>}>
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
    <article className="grid gap-8 sm:grid-cols-2">
      <Image src={product.imageUrl} alt={product.name} width={800} height={800} unoptimized className="aspect-square w-full bg-mist-soft object-cover" />
      <div className="flex flex-col gap-5">
        <h1 className="font-heading text-3xl leading-tight font-bold text-charcoal uppercase sm:text-4xl">{product.name}</h1>
        <p className="w-fit bg-promo px-4 py-2 text-3xl font-bold text-white">{formatPrice(product.priceCents)}</p>
        <p className="whitespace-pre-wrap text-base text-charcoal">{product.description}</p>
        <AddToCartButton product={{ id: product.id, name: product.name, priceCents: product.priceCents, imageUrl: product.imageUrl }} />
      </div>
    </article>
  );
}
