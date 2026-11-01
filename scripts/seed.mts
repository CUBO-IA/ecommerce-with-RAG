import { createProduct, deleteProduct, listProducts } from "../src/products";

const U = "https://images.unsplash.com/photo-";
const products: [string, string, number, string][] = [
  ["Licuadora de vaso 1.5 L", "Licuadora de 700 W con vaso de vidrio y cuchillas de acero inoxidable, ideal para batidos y salsas.", 59.9, "1654064754916-e3edeb09c042"],
  ["Cafetera de goteo programable", "Cafetera de 12 tazas con jarra térmica y temporizador de encendido automático.", 79.0, "1608354580875-30bd4168b351"],
  ["Juego de cuchillos de chef", "Set de cuchillos de acero inoxidable con mango ergonómico para cortar, picar y filetear.", 64.5, "1593618229012-8aaad1cfefc3"],
  ["Sartén antiadherente 28 cm", "Sartén de aluminio forjado con recubrimiento antiadherente, apta para todo tipo de cocinas.", 34.9, "1581622558638-818128465982"],
  ["Tostadora de 2 ranuras", "Tostadora de acero con 7 niveles de tostado y bandeja recogemigas extraíble.", 42.0, "1686644823126-7ed947386b77"],
  ["Hervidor eléctrico de acero", "Hervidor de 1.7 L con apagado automático y base giratoria de 360°.", 38.5, "1788238025571-31c4310a4f7e"],
  ["Set de toallas de baño", "Juego de toallas de algodón 100% absorbente, suaves y de secado rápido.", 29.9, "1616663717839-2fea42e1a1f6"],
  ["Cabezal de ducha dorado", "Regadera de lluvia de alta presión con manguera flexible y acabado dorado.", 54.0, "1771681587476-f2846a2c9102"],
  ["Báscula digital de baño", "Báscula de vidrio templado con pantalla LED y capacidad hasta 180 kg.", 24.9, "1522844990619-4951c40f7eda"],
  ["Portacepillos de bambú", "Portacepillos de madera de bambú con compartimentos para el cuidado dental.", 12.5, "1634068966402-86a27b9d57c1"],
  ["Dispensador de jabón", "Dispensador de jabón líquido con bomba y diseño minimalista para el lavabo.", 14.9, "1645567455251-334ed4702f9b"],
  ["Control inalámbrico para consola", "Mando inalámbrico con vibración, gatillos adaptativos y batería recargable.", 69.9, "1509198397868-475647b2a1e5"],
  ["Bocina Bluetooth portátil", "Altavoz resistente al agua con 12 horas de batería y sonido estéreo potente.", 89.0, "1608043152269-423dbba4e7e1"],
  ["Audífonos inalámbricos", "Audífonos Bluetooth con cancelación de ruido y 30 horas de autonomía.", 129.0, "1618366712010-f4ae9c647dcb"],
  ["Juego de mesa familiar", "Juego de estrategia con tablero, fichas y dados para 2 a 6 jugadores.", 39.9, "1629760946220-5693ee4c46ac"],
  ["Proyector LED portátil", "Proyector Full HD con conexión HDMI y Wi-Fi para cine en casa.", 219.0, "1535016120720-40c646be5580"],
  ["Tapete de yoga antideslizante", "Tapete de 6 mm de grosor, ligero y enrollable, con superficie antideslizante.", 27.5, "1763004871583-4183d64096b1"],
  ["Mancuernas de neopreno (par)", "Par de mancuernas de 5 kg con recubrimiento de neopreno para entrenar en casa.", 45.0, "1638536532686-d610adfc8e5c"],
  ["Tienda de campaña 3 personas", "Carpa impermeable de montaje rápido, ventilada y fácil de transportar.", 119.0, "1504280390367-361c6d9f38f4"],
  ["Lámpara de escritorio articulada", "Lámpara LED con brazo ajustable, tres temperaturas de luz y control táctil.", 36.0, "1519219788971-8d9797e0928e"],
  ["Silla de oficina ergonómica", "Silla con soporte lumbar, respaldo de malla y altura regulable.", 189.0, "1688578735352-9a6f2ac3b70a"],
  ["Mochila urbana", "Mochila resistente con compartimento acolchado para laptop de 15 pulgadas.", 49.9, "1553062407-98eeb64c6a62"],
  ["Cojín decorativo", "Cojín de textura suave con funda removible, ideal para sofá o cama.", 18.9, "1629949009765-40fc74c9ec21"],
  ["Aspiradora inalámbrica", "Aspiradora de mano con filtro HEPA, 40 minutos de autonomía y accesorios.", 149.0, "1778062868373-e3cb41963ae5"],
  ["Cesto para ropa sucia", "Cesto plegable de tela resistente con asas, para el lavadero o el cuarto.", 21.0, "1582735689369-4fe89db7114c"],
  ["Dron con cámara 4K", "Dron plegable con cámara 4K, estabilizador de 3 ejes y 30 minutos de vuelo.", 399.0, "1521405924368-64c5b84bec60"],
  ["Taladro inalámbrico 20 V", "Taladro atornillador con dos baterías, maletín y juego de brocas.", 99.0, "1572981779307-38b8cabb2407"],
  ["Guitarra acústica", "Guitarra acústica de tamaño completo con cuerdas de acero y cuerpo de madera.", 159.0, "1558098329-a11cff621064"],
  ["Reloj de pulsera analógico", "Reloj de acero inoxidable con esfera plateada y resistencia al agua 50 m.", 95.0, "1620625515032-6ed0c1790c75"],
  ["Gafas de sol polarizadas", "Gafas de sol con lentes polarizados y protección UV400, estilo clásico.", 32.0, "1572635196237-14b3f281503f"]
];

const names = new Set(products.map(([n]) => n));
const existing = new Set<string>();
for (const p of await listProducts()) {
  if (names.has(p.name) && !existing.has(p.name)) existing.add(p.name);
  else await deleteProduct(p.id);
}

for (const [name, description, price, photo] of products) {
  if (existing.has(name)) continue;
  const res = await fetch(`${U}${photo}?w=1080&fm=jpg&q=80`);
  if (!res.ok) throw new Error(`${name}: imagen ${res.status}`);
  const file = new File([await res.arrayBuffer()], "image.jpg", { type: "image/jpeg" });
  for (;;) {
    try {
      await createProduct({ name, description, price }, file);
      break;
    } catch {
      // límite de embeddings gratis (20/min): esperar y reintentar
      await new Promise((r) => setTimeout(r, 65_000));
    }
  }
  console.log("ok", name);
}
process.exit(0);
