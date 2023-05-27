const PORT = process.env.PORT
const DB_USER = process.env.DB_USER 
const DB_PASSWORD = process.env.DB_PASSWORD 
const DB_HOST = process.env.DB_HOST 
const BD_NAME = process.env.BD_NAME || "serviA"
const BD_PORT = process.env.BD_PORT 
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