export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("es", { style: "currency", currency: "USD" }).format(cents / 100);
}
