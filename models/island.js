'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Island extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Island.belongsTo(models.Game);
    }
  };
  Island.init({
    islandId: DataTypes.INTEGER,
    food: DataTypes.INTEGER,
    wood: DataTypes.INTEGER,
    gold: DataTypes.INTEGER,
    weapons: DataTypes.INTEGER,
    improvements: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Island',
  });
  return Island;
};