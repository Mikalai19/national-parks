'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //models.State.hasMany(models.Trail, { foreignKey: 'stateId' });
      models.State.hasMany(models.Park, { foreignKey: 'stateId' });
    }
  };
  State.init({
    name: DataTypes.STRING,
    numberOfParks: DataTypes.INTEGER,
    parkId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'State',
  });
  return State;
};