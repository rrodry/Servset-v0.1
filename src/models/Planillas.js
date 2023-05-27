const { Sequelize, UUID, UUIDV4 } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('planillas', {
    id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name:{
      type: Sequelize.DATE
    },
    servicios: {
      type: Sequelize.TEXT
    },
    dayTime: {
        type: Sequelize.DATE
    }
  });
};
