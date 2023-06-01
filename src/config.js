const PORT = process.env.PORT || 3001
const DB_USER = process.env.DB_USER || "root"
const DB_PASSWORD = process.env.DB_PASSWORD || "rodrygo45"
const DB_HOST = process.env.DB_HOST || "serviabd.cqp6qkskibct.sa-east-1.rds.amazonaws.com"
const BD_NAME = process.env.BD_NAME || "ServSet"
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