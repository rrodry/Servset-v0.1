const { Sequelize, UUID, UUIDV4 } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('servicios', {
    id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    servicios: {
      type: Sequelize.INTEGER
    },
    movil:{
      type: Sequelize.STRING()
    }
  });
};
