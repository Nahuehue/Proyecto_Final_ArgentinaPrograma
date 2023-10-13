const { DataTypes } = require('sequelize')
const sequelize = require('../connection/connection')

const Catalogo = sequelize.define('Catalogo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resumen: {
    type: DataTypes.STRING
  },
  temporadas: {
    type: DataTypes.INTEGER
  },
  reparto: {
    type: DataTypes.STRING
  },
  poster: {
    type: DataTypes.STRING,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  trailer: {
    type: DataTypes.STRING
  },
}, {
  tableName: 'vista_tipo_json',
  timestamps: false
})

module.exports = Catalogo


