const { Sequelize, UUID, UUIDV4 } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('users', {
    id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    usuario: {
      type: Sequelize.STRING()
    },
    password:{
      type: Sequelize.STRING()
    },
    nombre: {
      type: Sequelize.STRING()
    },
    apellido: {
      type: Sequelize.STRING()
    },
    turno:{
      type: Sequelize.STRING()
    }
  });
};
