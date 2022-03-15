'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsToMany(models.User, { through: 'User_Task', foreignKey: 'task_id', otherKey: 'user_id' })
    }
  }
  Task.init({
    task_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      require: true
    },
    task_name: {
      type: DataTypes.STRING,
      require: true,
    },
    task_value: {
      type: DataTypes.INTEGER,
      require: true,
    },
    type: {
      type: DataTypes.CHAR(1),
      require: true,
    },
    committee_id: {
      type: DataTypes.INTEGER,
      require: true,
      // references: {
      //   model: 'committees',
      //   key: 'committee_id'
      // }
    },

  },
    {
      sequelize,
      modelName: 'Task',
    });
  return Task;
};