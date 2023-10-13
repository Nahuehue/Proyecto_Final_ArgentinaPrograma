const { DataTypes } = require('sequelize')
const sequelize = require('../connection/connection')


const Generos = sequelize.define('Generos', {
  generos_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      autoIncrement: true
  },
  generos_nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
},{
    tableName: 'generos', 
    timestamps: false,
});


module.exports = Generos
