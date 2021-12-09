'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Favorite.belongsTo(models.Park, { foreignKey: 'parkId' });
      models.Favorite.belongsTo(models.State, { foreignKey: 'stateId' });
      models.Favorite.belongsTo(models.User, { foreignKey: 'userId' });
    }
  };
  Favorite.init({

  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};