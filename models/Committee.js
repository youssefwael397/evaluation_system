'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Committee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Committee.hasMany(models.User, { foreignKey: 'first_com_id', sourceKey: 'committee_id' })
      Committee.hasMany(models.User, { foreignKey: 'second_com_id', sourceKey: 'committee_id' })
      Committee.hasMany(models.Task, { foreignKey: 'committee_id', sourceKey: 'committee_id' })

    }
  }
  Committee.init({
    committee_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      require: true
    },
    committee_name: {
      type: DataTypes.STRING,
      require: true,
      unique: true

    }
  }, {
    sequelize,
    modelName: 'Committee',
  });
  return Committee;
};