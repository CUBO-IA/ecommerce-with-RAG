import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { db } from "../prisma/db.ts";
import { lexicalProducts } from "./lexical.ts";

const DIM = 2048;
const zero = Array.from({ length: DIM }, () => 0);

const ids: number[] = [];

before(async () => {
  const fixtures = [
    ["Licuadora Oster 900W", "Licuadora de vaso de vidrio para batidos y hielo", 4500],
    ["Cafetera de cápsulas", "Cafetera compacta para espresso y café largo", 8900],
    ["Sartén antiadherente", "Sartén de cocina de 28 cm", 2500],
  ] as const;
  for (const [name, description, priceCents] of fixtures) {
    const row = await db.orm.public.Product.select("id").create({
      name: `test-lexical-${name}`,
      description,
      priceCents,
      imageKey: "fixture.png",
      embedding: zero
    });
    ids.push(row.id);
  }
});

after(async () => {
  for (const id of ids) await db.orm.public.Product.where((p) => p.id.eq(id)).delete();
  await db.close();
});

test("lexicalProducts encuentra por palabras y ignora productos sin coincidencia", async () => {
  const rows = await lexicalProducts("licuadora", 10);
  const found = rows.map((r) => r.id).filter((id) => ids.includes(id));
  assert.deepEqual(found, [ids[0]]);
});

test("lexicalProducts respeta el rango de precio", async () => {
  const all = await lexicalProducts("cafetera", 10);
  assert.ok(all.some((r) => r.id === ids[1]));
  const cheap = await lexicalProducts("cafetera", 10, { maxPriceCents: 5000 });
  assert.equal(cheap.filter((r) => ids.includes(r.id)).length, 0);
});
