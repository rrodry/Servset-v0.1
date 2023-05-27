const PORT = process.env.PORT || 3001
const DB_USER = process.env.DB_USER || "root"
const DB_PASSWORD = process.env.DB_PASSWORD || "Ws3aBINt1toZbubwoBd1r2hlWgQ9DUd0"
const DB_HOST = process.env.DB_HOST || "dpg-choqlmqk728ivvuf6j0g-a.oregon-postgres.render.com"
const BD_NAME = process.env.BD_NAME || "bd_postg"
const BD_PORT = process.env.BD_PORT || 5432
const SECRET = '3306'
const dialect = 'mysql'

module.exports = { 
    PORT ,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    BD_NAME,
    BD_PORT,
    dialect,
    SECRET
}