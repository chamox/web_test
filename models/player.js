'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Player.belongsTo(models.Room);
      models.Player.belongsTo(models.User);
    }
  };
  Player.init({
    userId: DataTypes.INTEGER,
    username: DataTypes.STRING,
    shipId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};