import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { db } from "../prisma/db.ts";
import { nearestProducts } from "./nearest.ts";

const DIM = 2048;
const unit = (i: number) => Array.from({ length: DIM }, (_, j) => (j === i ? 1 : 0));

const ids: number[] = [];

before(async () => {
  const fixtures = [["a", unit(0), 100], ["b", unit(1), 5000], ["c", unit(2), 300]] as const;
  for (const [name, embedding, priceCents] of fixtures) {
    const row = await db.orm.public.Product.select("id").create({
      name: `test-nearest-${name}`,
      description: "fixture",
      priceCents,
      imageKey: "fixture.png",
      embedding
    });
    ids.push(row.id);
  }
});

after(async () => {
  for (const id of ids) await db.orm.public.Product.where((p) => p.id.eq(id)).delete();
  await db.close();
});

test("nearestProducts ordena por distancia coseno, el más cercano primero", async () => {
  const query = unit(0).map((x, j) => (j === 0 ? 0.3 : j === 1 ? 0.9 : x));
  const rows = await nearestProducts(query, 1000);
  const ours = rows.filter((r) => ids.includes(r.id)).map((r) => r.id);

  assert.deepEqual(ours, [ids[1], ids[0], ids[2]]);
});

test("nearestProducts filtra por rango de precio", async () => {
  const query = unit(1);
  const under = (await nearestProducts(query, 1000, { maxPriceCents: 1000 })).map((r) => r.id).filter((id) => ids.includes(id));
  const over = (await nearestProducts(query, 1000, { minPriceCents: 1000 })).map((r) => r.id).filter((id) => ids.includes(id));

  assert.deepEqual(under.sort(), [ids[0], ids[2]].sort());
  assert.deepEqual(over, [ids[1]]);
});
