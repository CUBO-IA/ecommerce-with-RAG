# Features and routes

This guide describes the features currently implemented in the prototype. See the [repository README](../README.md) for project setup and framework context.

## Public catalog and search

The catalog is available at `/`. It loads products from the product store, newest first, and displays each product's image, name, description, and price. Selecting a card opens the product detail page.

If there are no products, the catalog shows an empty state with a link to `/admin/products`. The header's search field and category links are visual placeholders: the public catalog has no working direct text-search or category-filter UI.

The shopping assistant is the working product-discovery search surface (see [Chatbot integration](./chatbot.md)). Its product search layer supports two modes:

- **Lexical search** (`searchProductsByName`): Spanish PostgreSQL full-text search over product names and descriptions, ranked by text relevance.
- **Semantic search** (`searchProductsByMeaning`): embeds the query and returns products by nearest embedding similarity.

Both modes accept optional inclusive minimum and maximum price bounds. The assistant supplies those bounds in dollars; the product layer receives cents. The product functions default to five results (with a caller-supplied limit also supported). No category, brand, or other product filters are implemented in these searches.

## Product details

`/product/[id]` displays a product image, name, USD price, description, and an **Add to cart** action. The `id` segment must contain digits and identify an existing product; otherwise the route renders the not-found page.

Adding a product creates a cart line with quantity one, or increments the existing line's quantity by one. The button briefly changes its label to confirm the addition.

## Admin product management

`/admin/products` is the prototype product-management page. It currently has no authentication or authorization and must not be treated as a production admin surface.

The form creates products with:

- a required name, trimmed to 1–120 characters;
- a required description, trimmed to 1–2,000 characters;
- a positive USD price, stored as cents; and
- a required JPEG, PNG, or WebP image no larger than 5 MB.

The page also lists existing products and provides a **Delete** action. Editing existing products is not implemented.

## Cart

`/cart` shows the current lines, unit prices, quantities, line totals, and cart total. Users can increase or decrease quantities, remove individual lines, or empty the cart. Decreasing a line below one removes it.

Cart state is client-side and persisted in `localStorage` under the `cart` key. It is scoped to the same browser profile and site origin across routes and reloads, not to a signed-in user, another browser or device, or a server-side session. The cart hydrates after the page loads, so the route shows a loading state before stored items are available. Each line retains a product snapshot; totals use its stored `priceCents` value, and the cart page does not fetch current product prices while rendering.

## Checkout limitation

The checkout/continue-purchase button on `/cart` is currently a placeholder with no action. There is no implemented checkout, payment, order-creation, or checkout-time price-revalidation flow. Users can manage a local cart, but they cannot complete a purchase through the prototype.

## Route summary

| Route | Purpose |
| --- | --- |
| `/` | Public product catalog |
| `/product/[id]` | Product detail and add-to-cart action |
| `/cart` | Local cart management |
| `/admin/products` | Create and delete products in the prototype admin UI |
