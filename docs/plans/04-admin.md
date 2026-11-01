# Fase 4 — Admin: registro de productos

**Objetivo:** cargar, listar y borrar productos desde `/admin/products`, sin autenticación.

> Antes de empezar, leer en `node_modules/next/dist/docs/` la guía vigente de Server Actions y formularios (este Next tiene cambios incompatibles).

## Server Actions — `app/admin/products/actions.ts`

- [x] `createProductAction(prev, formData)`:
  - lee `name`, `description`, `price` y `image`
  - llama a `createProduct`
  - devuelve `{ ok }` o `{ error }` (errores de zod en texto legible)
  - `revalidatePath("/")` y `revalidatePath("/admin/products")`
- [x] `deleteProductAction(id)` con las mismas revalidaciones.

## Página — `app/admin/products/page.tsx`

- [x] Server Component que lista los productos con `listProducts()`.
- [x] Formulario (Client Component con `useActionState`):
  - campos: nombre, descripción (textarea), precio (`type="number" step="0.01"`), imagen (`type="file" accept="image/*"`)
  - estado de envío deshabilitando el botón, y mensaje de error o éxito
  - vista previa de la imagen elegida (opcional) — no implementada
- [x] Tabla o lista con miniatura, nombre, precio y botón borrar.
- [x] Marcar la ruta con un comentario `ponytail:` — sin auth, solo PoC.
- [x] Etiquetas `label` y `alt` correctos (accesibilidad básica).

## Criterio de salida

- [x] Se crea un producto con imagen. Aparece en la lista y en la consola de RustFS.
- [x] El archivo no válido (tipo o tamaño) muestra un error y no sube nada.
- [x] Borrar elimina la fila y el objeto del bucket.
- [x] Si falla el embedding (por ejemplo, key inválida), no queda imagen huérfana.
