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

export const plants = pgTable('plants', {
    id: serial('id').primaryKey(),
    name: jsonb('name').notNull(), // @todo add model validation for the jsonb object?
    userId: integer('user_id').references(() => users.id).primaryKey(),
    createdAt: timestamp('createdAt').defaultNow(),
}, (plants) => ({
    userIdIndex: index('plants_user_id_index').on(plants.userId)
}))
