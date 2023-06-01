require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST,BD_NAME,BD_PORT, dialect
} = require('./config')
const sequelize = new Sequelize(BD_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql"
});

console.log(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${BD_PORT}/${BD_NAME}`);
const basename = path.basename(__filename);

sequelize.authenticate()
  .then(()=>{console.log("conectado");})
  .catch((e)=>{
    console.log(console.log('ERROR ES: '+ e));
})
const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Servicios, Users, Planillas } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
Servicios.belongsToMany(Users, {through: "servi_middle"})
Users.belongsToMany(Servicios, {through: "servi_middle"})




module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
