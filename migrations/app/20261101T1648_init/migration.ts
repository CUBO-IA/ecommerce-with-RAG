#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3e90b47c608778fe474b63cd3718dc157bd13056edbbe60cbd3e0546565f4cea/contract';
import endContract from '../../snapshots/3e90b47c608778fe474b63cd3718dc157bd13056edbbe60cbd3e0546565f4cea/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Document',
        columns: [
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('embedding', 'vector(2048)', {
            codecRef: { codecId: 'pg/vector@1', typeParams: { length: 2048 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
