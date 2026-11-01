# Fase 7 — Verificación end-to-end

**Objetivo:** confirmar que todo funciona junto desde cero.

## Arranque limpio

- [x] `docker compose down -v && docker compose up -d`
- [x] Aplicar la migración sobre la base vacía.
- [x] `pnpm dev` sin errores.

## Datos de prueba

- [x] Cargar de 5 a 10 productos variados (distintas categorías y rangos de precio) desde `/admin/products`.
  - 8 productos: cuchillo 45,00; sartén 18,50; taza 9,90; tren de madera 24,00 (borrado luego); peluche 12,00; auriculares 89,00; libreta 6,50; lámpara 35,00. Imágenes PNG generadas localmente y subidas por el formulario.

## Casos

- [x] La home lista todos los productos con su imagen.
- [x] Consulta por categoría: "busco algo para la cocina". Respondió con cuchillo, sartén y taza, más tarjetas de otros productos (tren, libreta).
- [x] Consulta por precio: "algo barato, menos de 20 dólares". Antes no cumplía (la tool no filtraba por precio y el bot daba conteos incorrectos). Ahora la tool recibe `maxPrice: 20`, `/api/chat` devuelve exactamente los 4 productos bajo 20 US$ (sartén 18,50, taza 9,90, libreta 6,50, peluche 12,00) y el bot dice "4".
- [x] Consulta fuera de catálogo: "¿Tienen bicicletas de montaña y zapatos de fútbol talla 42?" Respondió que no hay esos productos y no inventó. Observación: hizo dos búsquedas y las tarjetas salieron duplicadas.
- [x] Borrar un producto: desaparece de la home y del chat. Verificado con "Tren de madera": no aparece en la home ni en la búsqueda de juguetes de madera.

## Calidad

- [x] `pnpm lint`
- [x] `pnpm build`
- [x] La prueba de búsqueda de la Fase 3 pasa.

## Pendientes y mejoras (fuera del PoC)

- [ ] Auth para `/admin`.
- [ ] Carrito y checkout simulado.
- [ ] Índice ANN (`halfvec` + HNSW).
- [x] Filtro por precio en la tool de búsqueda. `searchProducts` acepta `minPrice`/`maxPrice` (dólares) y filtra en SQL antes del top-k; prueba de integración en `nearest.test.mts`.
- [ ] Varias imágenes por producto.
