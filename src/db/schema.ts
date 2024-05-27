import { index, integer, pgEnum, pgTable, serial, smallint, text, timestamp, varchar } from 'drizzle-orm/pg-core'

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

// export const moodRatings = pgTable('mood_ratings', {
//     id: serial('id').primaryKey().notNull(),
//     value: smallint('value'),
//     timestamp: timestamp('timestamp', { mode: 'date' }).notNull(),
//     userId: integer('user_id').references(() => users.id).notNull()
// }, (moodRatings) => ({
//     userIdIdx: index('mood_ratings_user_id_index').on(moodRatings.userId)
// }))
