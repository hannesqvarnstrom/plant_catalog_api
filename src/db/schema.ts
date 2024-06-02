import { index, integer, jsonb, pgEnum, pgTable, serial, smallint, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const providerEnum = pgEnum('provider', ['GOOGLE', 'FACEBOOK'])

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull(),
    password: varchar('password'),
    lastLogAt: timestamp('last_log_at', { mode: 'date', }),
}, (users) => ({
    emailIdx: index('users_email_index').on(users.email),
}))

export const federatedIdentities = pgTable('federated_identities', {
    provider: providerEnum('provider').notNull(),
    providerId: varchar('providerId'), // user's ID in remote
    createdAt: timestamp('createdAt').defaultNow(),
    userId: integer('user_id').references(() => users.id).primaryKey() // user_id in our DB
})
export const plantTypeEnum = pgEnum('type', ['cutting', 'seed', 'rhizome', 'none'])
export const plants = pgTable('plants', {
    id: serial('id').primaryKey(),
    name: jsonb('name').notNull(), // @todo add model validation for the jsonb object?
    fontSize: varchar('font_size').default('13px'),
    userId: integer('user_id').references(() => users.id).notNull(),

    fromTrader: integer('from_trader').references(() => traders.id),
    location: varchar('location'),
    type: plantTypeEnum('type').notNull(),

    createdAt: timestamp('createdAt').defaultNow(),
}, (plants) => ({
    userIdIndex: index('plants_user_id_index').on(plants.userId),
    traderIdIndex: index('plants_trader_id_index').on(plants.fromTrader)
}))

export const traders = pgTable('traders', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    createdBy: integer('created_by').references(() => users.id),
    createdAt: timestamp('createdAt').defaultNow(),
    location: varchar('location'),
})
