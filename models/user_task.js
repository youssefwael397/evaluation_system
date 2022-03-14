'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_Task.init({
    user_id: {
      type: DataTypes.INTEGER,

    },
    task_id: {
      type: DataTypes.INTEGER,

    },
    value: {
      type: DataTypes.INTEGER,
      require: true
    },
  }, {
    sequelize,
    modelName: 'User_Task',
  });
  return User_Task;
};