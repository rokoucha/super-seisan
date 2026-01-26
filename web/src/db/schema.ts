import { relations } from 'drizzle-orm'
import {
  index,
  int,
  primaryKey,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core'

export const seisans = sqliteTable('seisans', {
  id: text().primaryKey(),
  name: text().notNull(),
  icon: text().notNull(),
  createdAt: int('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: int('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
})

export const participants = sqliteTable(
  'participants',
  {
    id: text().primaryKey(),
    seisanId: text('seisan_id')
      .notNull()
      .references(() => seisans.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    icon: text().notNull(),
    createdAt: int('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (table) => [index('participants_seisan_id_idx').on(table.seisanId)],
)

export const currencies = sqliteTable(
  'currencies',
  {
    id: text().primaryKey(),
    seisanId: text('seisan_id')
      .notNull()
      .references(() => seisans.id, { onDelete: 'cascade' }),
    code: text().notNull(),
    rate: real().notNull(),
    createdAt: int('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (table) => [index('currencies_seisan_id_idx').on(table.seisanId)],
)

export const items = sqliteTable(
  'items',
  {
    id: text().primaryKey(),
    seisanId: text('seisan_id')
      .notNull()
      .references(() => seisans.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    icon: text().notNull(),
    payerId: text('payer_id')
      .notNull()
      .references(() => participants.id, { onDelete: 'cascade' }),
    price: real().notNull(),
    currencyId: text('currency_id').references(() => currencies.id, {
      onDelete: 'set null',
    }),
    amount: int().notNull(),
    total: real().notNull(),
    version: int().notNull().default(1),
    createdAt: int('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: int('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index('items_seisan_id_idx').on(table.seisanId),
    index('items_payer_id_idx').on(table.payerId),
  ],
)

export const itemExempts = sqliteTable(
  'item_exempts',
  {
    itemId: text('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),
    participantId: text('participant_id')
      .notNull()
      .references(() => participants.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.itemId, table.participantId] })],
)

export const seisansRelations = relations(seisans, ({ many }) => ({
  participants: many(participants),
  currencies: many(currencies),
  items: many(items),
}))

export const participantsRelations = relations(
  participants,
  ({ one, many }) => ({
    seisan: one(seisans, {
      fields: [participants.seisanId],
      references: [seisans.id],
    }),
    itemsAsPayer: many(items, { relationName: 'payer' }),
    itemExempts: many(itemExempts),
  }),
)

export const currenciesRelations = relations(currencies, ({ one, many }) => ({
  seisan: one(seisans, {
    fields: [currencies.seisanId],
    references: [seisans.id],
  }),
  items: many(items),
}))

export const itemsRelations = relations(items, ({ one, many }) => ({
  seisan: one(seisans, {
    fields: [items.seisanId],
    references: [seisans.id],
  }),
  payer: one(participants, {
    fields: [items.payerId],
    references: [participants.id],
    relationName: 'payer',
  }),
  currency: one(currencies, {
    fields: [items.currencyId],
    references: [currencies.id],
  }),
  exempts: many(itemExempts),
}))

export const itemExemptsRelations = relations(itemExempts, ({ one }) => ({
  item: one(items, {
    fields: [itemExempts.itemId],
    references: [items.id],
  }),
  participant: one(participants, {
    fields: [itemExempts.participantId],
    references: [participants.id],
  }),
}))
