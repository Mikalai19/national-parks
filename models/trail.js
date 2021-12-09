'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Trail.belongsTo(models.Park, { foreignKey: 'parkId' });
      // models.Trail.belongsTo(models.State, { foreignKey: 'stateId' });
    }
  };
  Trail.init({
    name: DataTypes.STRING,
    length: DataTypes.STRING,
    difficulty: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Trail',
  });
  return Trail;
};