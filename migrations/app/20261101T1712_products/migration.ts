#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/3e90b47c608778fe474b63cd3718dc157bd13056edbbe60cbd3e0546565f4cea/contract';
import startContract from '../../snapshots/3e90b47c608778fe474b63cd3718dc157bd13056edbbe60cbd3e0546565f4cea/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/6e4759869f8cb14d3d5fb6cb37103501a650d9bcaace8714d5fc99bb8135aec9/contract';
import endContract from '../../snapshots/6e4759869f8cb14d3d5fb6cb37103501a650d9bcaace8714d5fc99bb8135aec9/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'Document' }),
      this.createTable({
        schema: 'public',
        table: 'Product',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('embedding', 'vector(2048)', {
            codecRef: { codecId: 'pg/vector@1', typeParams: { length: 2048 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('imageKey', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('priceCents', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
