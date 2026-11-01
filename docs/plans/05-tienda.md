# Fase 5 — Tienda pública

**Objetivo:** que los visitantes vean el catálogo.

## Componentes

- [x] `src/components/ProductCard.tsx`: imagen, nombre, precio formateado y descripción corta (la usarán la tienda y el chat).
- [x] Helper `formatPrice(cents)` con `Intl.NumberFormat("es", { style: "currency", currency: "USD" })` (en `src/products/format.ts`).

## Página

- [x] Reemplazar `app/page.tsx` por una grilla responsive con `listProducts()` (Tailwind).
- [x] Estado vacío con un enlace a `/admin/products`.
- [x] Imágenes con `next/image` + `unoptimized` (mismo patrón que admin; no requiere `remotePatterns`).
- [x] Ajustar `app/layout.tsx`: `lang="es"`, título y descripción.
- [x] Detalle en `/products/[id]`: omitido (no hace falta).

## Criterio de salida

- [x] La home muestra los productos cargados, con sus imágenes de RustFS.
- [x] La vista es usable en móvil y en escritorio. (Verificado escritorio; móvil por clases Tailwind `grid-cols-1` base, sin captura por límite del navegador.)
- [x] Un producto nuevo del admin aparece sin reiniciar.
