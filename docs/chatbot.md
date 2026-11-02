# Chatbot integration

For local setup, see [Getting started](./getting-started.md). See [Architecture](./architecture.md) for the wider application boundaries and [Features](./features.md) for the user-facing feature summary.

## Entry points

- `app/api/chat/route.ts` exposes `POST /api/chat`.
- `src/components/ChatWidget.tsx` is the client-side chat UI. It uses `useChat` with `DefaultChatTransport` and sends requests to `/api/chat`.
- `src/ai/chat.ts` defines the system prompt, tool schemas, tool execution, and the `ChatMessage` type.
- `src/ai/anthropic.ts` selects the chat provider and model.
- `src/ai/openrouter.ts` provides embeddings for semantic product search.

The route accepts a body with at least one `messages` item. It also accepts an optional `path` string (maximum 200 characters) and an optional cart containing product IDs and positive quantities. Invalid JSON, message history, or cart data returns HTTP 400. Successful responses are streamed as UI messages, with a 60-second route duration limit.

## Provider configuration

The providers read these environment variables:

- `ANTHROPIC_API_KEY` authenticates Anthropic chat requests. The configured model is `claude-haiku-5-5`.
- `OPENROUTER_API_KEY` authenticates embedding requests. The configured embedding model is `nvidia/nemotron-3.5-embed-1b:free`.

Keep credential values in the local environment; do not copy them into documentation or source control. The embedding input is the product name and description when a product is created, or the user's search query for semantic search.

## Available tools

The model receives these tools from `src/ai/chat.ts`:

| Tool | Input | Behavior |
| --- | --- | --- |
| `searchProductsByName` | `query`, optional `minPrice` and `maxPrice` in dollars | Searches the product name and description with Spanish PostgreSQL full-text search. Price bounds are inclusive. |
| `searchProductsByMeaning` | `query`, optional `minPrice` and `maxPrice` in dollars | Embeds the query and returns nearest products from the 2048-dimensional product embeddings. Price bounds are inclusive. |
| `openProduct` | `id` | Loads a product for navigation. The widget routes to `/product/<id>` when the result is available. |
| `addToCart` | `id` | Loads a product snapshot. The widget adds it to the browser cart when the result is available. |
| `viewCart` | no arguments | Resolves the cart IDs against current product records and returns item quantities, formatted unit prices, subtotals, and a formatted total. |
| `getProduct` | `id` | Returns the product details for display without navigating. |
| `getSalesGuide` | `topic`: `apertura`, `calificar`, `recomendar`, `objeciones`, or `cierre` | Returns the short sales guide for the requested conversation stage. |

Search price values are supplied in dollars at the tool boundary and converted to cents before querying. Product search results expose `id`, `name`, `description`, a formatted `price`, and `imageUrl`. The prompt tells the assistant to use the appropriate search tool before recommendations or prices, avoid inventing catalog data, stay on store topics, and answer in short Spanish plain text.

## Product and cart context

`ChatWidget` adds the current browser pathname and a compact cart projection to every request:

- When `/product/<id>` matches an existing product, the route loads it and adds its ID, name, formatted price, and description to the model instructions. On `/`, it tells the model that the catalog is being viewed. Other paths add no page context.
- The cart is stored in browser `localStorage` under the `cart` key. The widget sends only each item's `id` and `quantity`; the route validates positive integer IDs, at most 100 items, and integer quantities from 1 through 999.
- `viewCart` looks up products on the server before calculating totals, so its prices come from the current product records rather than the browser's stored price snapshot. Unknown product IDs are omitted from the returned summary.
- `addToCart` is a UI side effect: a successful tool result is passed to `CartProvider.add`. Adding an existing ID increments its quantity; otherwise the item starts at quantity 1.

Search results and `getProduct`/`openProduct` results render as compact product cards. `openProduct` navigates, while `addToCart` updates the local cart. The cart provider persists item snapshots in `localStorage`, and its UI totals use those stored prices; the source notes that any future checkout must revalidate prices against the server. There is no checkout implementation in this integration.

## Extending the integration

Add model-callable behavior in `chatTools` with a Zod input schema and an `execute` function. If the behavior needs a visible result or browser side effect, also handle its tool output in `ChatWidget`. Keep provider/model changes in `src/ai/anthropic.ts` or `src/ai/openrouter.ts` rather than duplicating provider setup in the route.

One current prototype limitation is that semantic search performs a sequential nearest-neighbor scan over `vector(2048)` embeddings; `src/products/index.ts` documents that the current dimension is not using an HNSW or IVFFlat index.
