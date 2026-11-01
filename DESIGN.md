# Design System: Siman.com (El Salvador)

## 1. Visual Theme & Atmosphere

Tienda online de retail masivo con estética promocional y comercial. Densa, saturada, orientada a ofertas: bandas de anuncios rojos, banners de campaña y un hero con producto y precio grande.

- Overall feeling: enérgico, de oferta, cálido por el rojo dominante.
- Visual density: alta. Muchos módulos, carruseles y tarjetas de producto.
- Brand posture: retail accesible; el precio y las cuotas sin intereses son el mensaje principal.
- Signature motifs: barra superior roja con promo, logo "S" en rombo, chip de cuotas "12 CUOTAS" en rojo, precio grande en círculo/etiqueta roja, botón "Agregar al carrito" en píldora roja.

### Key Characteristics

- Cabecera roja sólida con buscador blanco redondeado y carrito a la derecha.
- Barra de categorías horizontal debajo del header, con enlaces en negrita y emojis ocasionales.
- Banners de campaña a ancho completo (rojo, dorado navideño, fotografía de producto).
- Tipografía sans-serif neutra (Roboto) para casi todo el contenido.
- Botones de acción en rojo con forma de píldora.

## 2. Color Palette & Roles

Valores obtenidos de estilos computados en la página.

| Role | Semantic Name | Value | Usage |
| --- | --- | --- | --- |
| Primary action | Promo Red | `#D02D37` (rgb 208, 45, 55) | Botón "Agregar al carrito", chips de cuotas |
| Brand surface | Header Red | `#A83338` (rgb 168, 51, 56) | Fondo del header principal |
| Accent | Brand Wine | `#A93239` (rgb 169, 50, 57) | Iconos y acentos sobre fondo claro |
| Text | Ink Black | `#000000` | Texto de cuerpo por defecto |
| Text secondary | Charcoal | `#3F3F40` (rgb 63, 63, 64) | Títulos (h1) |
| Text tertiary | Gray 100 | `#646464` | Metadatos |
| Navy | Deep Navy | `#001A70` (rgb 0, 26, 112) | Texto de acento en secciones |
| Surface | White | `#FFFFFF` | Fondo de página |
| Surface soft | Mist | `#F1F1F1` / `#F9F9F9` | Fondos de bloques y botones secundarios |
| Button neutral | Cookie Gray | `#EFEFEF` with `#051C2C` text | Botón "Aceptar" del banner de cookies |
| Border | Not observed | — | — |

### Primary

- Promo Red `#D02D37`: acción principal y precios destacados.
- Header Red `#A83338`: identidad de marca en la cabecera.

### Interactive

- Enlaces de texto: el azul por defecto del navegador (`rgb(0, 0, 238)`) aparece en gran parte de los enlaces; no es un token de marca claro.
- Focus ring, hover colors: Not observed.

### Neutral Scale

- `#000000`, `#3F3F40`, `#646464`, `#B5B3B3`, `#F1F1F1`, `#F9F9F9`.

### Surface & Overlay

- Banner de cookies: panel oscuro semitransparente sobre el hero.

### Theme Modes

Solo se inspeccionó el modo claro. Modo oscuro: no observado.

#### Light Mode

- Background: `#FFFFFF`
- Surface: `#F1F1F1`
- Text: `#000000`
- Accent: `#D02D37`
- Notes: modo único inspeccionado.

### Shadows & Depth

- Bordes: sin borde visible en tarjetas de producto.
- Sombra de tarjetas: none observado en la tarjeta inspeccionada.
- Focus treatment: Not observed.

## 3. Typography Rules

Sistema de dos familias: Roboto para cuerpo y componentes, y ClanOT (con fallback Arial) en títulos.

### Font Family

- Primary: Roboto, sans-serif (cuerpo, navegación, botones).
- Display: ClanOT, Arial (h1 y encabezados de página).
- Monospace: no aplica.
- OpenType Features: Not observed.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Hero headline | ClanOT | Not observed | 700 | Not observed | Not observed | Mayúsculas, texto sobre imagen del hero |
| Section heading | Roboto | Not observed | 700 | Not observed | Not observed | Títulos de módulo: "Lo último en tecnología" |
| Body | Roboto | 16px | 400 | 18.4px (body) | Not observed | Texto general |
| Button | Roboto | 16px | 700 | Not observed | Not observed | "Agregar al carrito" |
| Nav / Category | Roboto | Not observed | 700 | Not observed | Not observed | Categorías en la barra superior |
| Caption / Meta | Roboto | 12px | 700 | Not observed | Not observed | Texto de botón del banner de cookies |

### Principles

- Peso 700 para acciones y navegación; el contraste viene del peso, no del tamaño.
- Mayúsculas reservadas al hero para tono de campaña.
- Precios grandes como elemento tipográfico principal de la tarjeta de producto.

## 4. Component Stylings

### Buttons and Links

**Primary CTA**

- Label: "Agregar al carrito"
- Background: `#D02D37`
- Text: `#FFFFFF`
- Radius: 100px (píldora)
- Height: Not observed
- Text style: Roboto 16px, 700

**Secondary CTA**

- Label: "Aceptar" (banner de cookies)
- Background: `#EFEFEF`
- Text: `#051C2C`
- Ring: Not observed
- Radius: 4px
- Height: Not observed
- Text style: 12px, 700

**Link Behavior**

- Text links: azul por defecto en enlaces de contenido.
- Hover and active feel: Not observed.

### Cards and Containers

- Surface style: fondo transparente, sin sombra visible en la tarjeta inspeccionada.
- Radius: Not observed.
- Border: none.
- Shadow or elevation: none.
- Internal spacing: Not observed.

### Inputs and Interactive Controls

- Input treatment: buscador blanco con radio alto, texto placeholder "Buscar".
- Focus behavior: Not observed.
- Selection states: Not observed.

### Navigation

- Structure: header rojo con menú hamburguesa, logo, buscador y carrito; debajo, barra de categorías desplazable horizontalmente.
- Background treatment: sólido `#A83338`.
- Link style: texto blanco con íconos y emojis.
- Sticky or scroll behavior: Not observed.

### Image Treatment

- Screenshot treatment: fotografía de producto y ambiente, sin marco.
- Photography or illustration style: fotos de producto en escena (sala, cocina) y banners ilustrados para campañas navideñas.
- Border and radius treatment: Not observed.

### Distinctive Components

- Banda de anuncio superior con cuotas ("HASTA 12 CUOTAS SIN INTERESES").
- Hero de ofertas con texto en mayúsculas sobre fotografía y tarjeta de precio.
- Carrusel de categorías con encabezados H3 ("Lo último en tecnología", "Lo mejor para tu hogar").
- Badge circular rojo con precio o descuento.

## 5. Layout Principles

### Spacing System

- Base unit: Not observed.
- Repeated spacing values: Not observed con precisión.

### Grid & Container

- Grid logic: bloques de ancho completo con carruseles y cuadrículas de producto.
- Max content width: Not observed.
- Section spacing: Not observed.

### Whitespace Philosophy

- Whitespace philosophy: densidad alta, poco aire entre módulos.
- Alignment tendencies: centrado en el hero, izquierda en listas y categorías.
- Content width behavior: a ancho completo en banners.

### Border Radius Scale

- Micro: 4px (botones secundarios)
- Standard: Not observed
- Large: Not observed
- Pill: 100px (CTA principal)

## 6. Depth & Elevation

| Level | Treatment | Use |
| --- | --- | --- |
| Flat | Sin sombra | Mayoría de contenido |
| Ring | Not observed | — |
| Card | Not observed (sin sombra en tarjeta inspeccionada) | — |
| Focus | Not observed | — |

### Depth Principles

- Surface hierarchy: plana; la jerarquía viene del color rojo y del contraste.
- Shadow language: no observado.
- Blur, glass, or overlay behavior: el banner de cookies usa un panel oscuro semitransparente.
- When depth is used versus avoided: evitado en contenido; usado solo en superposiciones.

## 7. Do's and Don'ts

### Do

- Usar el rojo como color de acción y promoción.
- Mostrar precio y cuotas de forma prominente.
- Usar Roboto 700 para botones y navegación.
- Mantener las píldoras rojas para "Agregar al carrito".

### Don't

- No introducir sombras o bordes en tarjetas sin evidencia; el sitio observado es plano.
- No usar tonos fríos como acento principal; el navy aparece solo como texto de apoyo.
- No mezclar más de un color de promoción en la misma banda.

## 8. Responsive Behavior

Solo se inspeccionó un ancho de viewport de 745px (el intento de redimensionar a 1440px no tuvo efecto en esta sesión). Los breakpoints no están verificados.

### Breakpoints

| Name | Width | Key Changes |
| --- | --- | --- |
| Mobile | 745px inspeccionado | Menú hamburguesa, barra de categorías desplazable, banners a ancho completo |
| Tablet | Not observed | — |
| Desktop | Not observed | — |

### Touch Targets

- Not observed.

### Collapsing Strategy

- Desktop behavior: Not observed.
- Tablet behavior: Not observed.
- Mobile behavior: header en una fila con buscador; categorías en barra horizontal.
- Breakpoint-driven component changes: Not observed.
- Touch target and spacing adjustments: Not observed.

## 9. Agent Prompt Guide

### Quick Color Reference

- Primary CTA: `#D02D37`
- Background: `#FFFFFF`
- Heading text: `#3F3F40`
- Body text: `#000000`
- Border or ring: Not observed
- Accent: `#A83338` (header), `#001A70` (navy de apoyo)

### Quick Summary

Retail promocional en rojo. Header rojo sólido con buscador blanco y carrito. Hero de ofertas con texto en mayúsculas sobre foto de producto. Botones "Agregar al carrito" en píldora roja `#D02D37` con Roboto 700. Tarjetas planas sin sombra. Tipografía Roboto para cuerpo y ClanOT para títulos. Densidad alta con muchos módulos y carruseles. Mensaje centrado en precio y cuotas sin intereses.

### Example Component Prompts

- Hero: "Banner de ancho completo con fotografía de producto, titular en mayúsculas blanco en ClanOT 700, y una etiqueta de precio roja circular."
- Card: "Tarjeta plana, sin sombra, con imagen, título en Roboto 700 y botón píldora rojo #D02D37 'Agregar al carrito'."
- Navigation: "Header rojo #A83338 con menú, logo, buscador blanco redondeado y carrito; debajo barra horizontal de categorías en negrita."
- Button or badge: "Botón píldora #D02D37, texto blanco Roboto 700 16px; badge de cuotas '12 CUOTAS SIN INTERESES' en rojo."

### Ready-to-Use Prompt

Diseña una página de tienda en español con estética promocional de retail: header rojo sólido `#A83338` con buscador blanco, carrito y barra de categorías en negrita. Hero de ancho completo con fotografía, titular en mayúsculas y precio destacado en círculo rojo `#D02D37`. Tarjetas de producto planas sin sombra, botón píldora rojo "Agregar al carrito". Roboto para cuerpo, peso 700 para acciones. Densidad alta.

### Iteration Guide

1. Mantener el rojo como único color de acción.
2. Preferir superficies planas; no añadir sombras.
3. Priorizar precio y cuotas sobre descripción.

## Optional Appendix: Interaction Patterns

- Scroll behavior: Not observed (barra de categorías desplazable horizontal).
- Hover behavior: Not observed.
- Click behavior: Not observed.
- Animation tone: Not observed.

## Optional Appendix: Content & Messaging Patterns

- Headline pattern: mayúsculas y promesa de ahorro ("OFERTAS QUE RENUEVAN TU HOGAR", "INICIAN LOS AHORROS ESPECTACULARES").
- CTA language: "Agregar al carrito", "Shop the look", "Ver más" (no verificado).
- Trust signal pattern: cuotas sin intereses y "SIMAN PRO".
- Voice and tone: promocional, directo, en español de El Salvador.

## Optional Appendix: Observed Pages

| URL | Inspected widths | Scope and limitations |
| --- | --- | --- |
| https://sv.siman.com/ | 745px (viewport) | Solo página de inicio, estado inicial con banner de cookies visible. Sin scroll completo, sin hover, sin páginas internas, sin modo oscuro. |

## Optional Appendix: Evidence Notes

- Observed: colores de header, botón de compra y texto por estilos computados; Roboto y ClanOT como familias; cabecera roja con buscador; banners de campaña; botones píldora.
- Inferred: tono promocional y jerarquía basados en la composición de la portada.
- Not inspected: escritorio (1440px), scroll completo, tarjetas de producto en detalle, estados hover/focus, modo oscuro, páginas internas, espaciado y radios exactos.
