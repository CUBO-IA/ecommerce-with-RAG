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
      <article className="flex items-center gap-3 bg-white text-ink">
        <Image src={imageUrl} alt={name} width={64} height={64} unoptimized className="size-16 shrink-0 bg-mist object-cover" />
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="truncate text-sm font-bold text-charcoal">{name}</h2>
          <p className="w-fit bg-promo px-2 py-0.5 text-sm font-bold text-white">{price}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-1 flex-col bg-white text-ink">
      <Image src={imageUrl} alt={name} width={400} height={400} unoptimized className="aspect-square w-full bg-mist-soft object-cover" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="line-clamp-2 text-base font-bold text-charcoal">{name}</h2>
        <p className="line-clamp-2 text-sm text-muted">{description}</p>
        <p className="mt-auto w-fit bg-promo px-3 py-1 text-xl font-bold text-white">{price}</p>
        <span className="mt-2 rounded-full bg-promo py-2 text-center text-base font-bold text-white">
          Ver producto
        </span>
      </div>
    </article>
  );
}
