
const { drizzle } = require('drizzle-orm/node-postgres')
const { Pool } = require('pg')
const { migrate } = require('drizzle-orm/node-postgres/migrator')
const { configDotenv } = require('dotenv')
const fs = require('fs')
configDotenv()
const connString = process.env.DATABASE_URL
const pool = new Pool({
    connectionString: connString
})
const dirContents = fs.readdirSync('./') 
console.log('dirContents:', dirContents)
const db = drizzle(pool)
migrate(db, {
    migrationsFolder: './drizzle'
}).then(result => {
    console.log('Result:', result)
    process.exit(0)
})
