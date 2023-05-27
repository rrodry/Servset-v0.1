const PORT = process.env.PORT || 3001
const DB_USER = process.env.DB_USER || "root"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const DB_HOST = process.env.DB_HOST || "localhost"
const BD_NAME = process.env.BD_NAME || "serviA"
const BD_PORT = process.env.BD_PORT || 3306
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