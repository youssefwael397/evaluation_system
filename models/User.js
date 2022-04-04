'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Task, { through: 'User_Task', foreignKey: 'user_id', otherKey: 'task_id' });
      User.belongsTo(models.Committee, { foreignKey: 'first_com_id', targetKey: 'committee_id' });
      User.belongsTo(models.Committee, { foreignKey: 'second_com_id', targetKey: 'committee_id' });

    }
  }
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      require: true
    },
    spe_id: {
      type: DataTypes.INTEGER,
      unique: true,
      require: false
    },
    user_name: {
      type: DataTypes.STRING,
      require: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      require: true
    },
    password: {
      type: DataTypes.STRING,
      require: true
    },
    facebook: {
      type: DataTypes.STRING,
      unique: true,
      require: true
    },
    gender: {
      type: DataTypes.CHAR(1),
      require: true
    },
    image: {
      type: DataTypes.STRING,
      require: true
    },
    phone: {
      type: DataTypes.STRING,
      unique: true
    },
    faculty: {
      type: DataTypes.STRING,
    },
    university: DataTypes.STRING,
    first_com_id: {
      type: DataTypes.INTEGER,
      require: true,

    },
    second_com_id: {
      type: DataTypes.INTEGER,

    },
    first_com_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      require: true
    },
    second_com_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      require: true
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      require: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};