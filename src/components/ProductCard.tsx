import Image from "next/image";

type ProductCardProps = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  compact?: boolean;
};

export function ProductCard({ name, description, price, imageUrl, compact = false }: ProductCardProps) {
  if (compact) {
    return (
      <article className="flex items-center gap-3 rounded-lg border bg-white p-2 text-zinc-950">
        <Image src={imageUrl} alt={name} width={64} height={64} unoptimized className="size-16 shrink-0 rounded object-cover" />
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">{name}</h2>
          <p className="text-sm font-medium">{price}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border bg-white text-zinc-950">
      <Image src={imageUrl} alt={name} width={400} height={400} unoptimized className="aspect-square w-full object-cover" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="font-semibold">{name}</h2>
        <p className="line-clamp-2 text-sm text-zinc-600">{description}</p>
        <p className="mt-auto font-medium">{price}</p>
      </div>
    </article>
  );
}
