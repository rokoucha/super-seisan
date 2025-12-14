import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const seisans = sqliteTable('seisans', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  legacyHash: text('legacy_hash').unique(),
  data: text({ mode: 'json' }),
  createdAt: int('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: int('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
})
