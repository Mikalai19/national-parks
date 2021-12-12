'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Park extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Park.belongsTo(models.State, { foreignKey: 'stateId' });
      models.Park.hasMany(models.Trail, { foreignKey: 'parkId' });
      //models.Park.hasOne(models.State, { foreignKey: 'parkId' });

    }
  };
  Park.init({
    name: DataTypes.STRING,
    about: DataTypes.TEXT,
    weatherInfo: DataTypes.TEXT,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    img: DataTypes.STRING,
    stateId: DataTypes.INTEGER,
    parkId: DataTypes.INTEGER


  }, {
    sequelize,
    modelName: 'Park',
  });
  return Park;
};