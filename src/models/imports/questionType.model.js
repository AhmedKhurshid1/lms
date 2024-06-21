const sequelize = require("sequelize");
const { DataTypes } = require('sequelize');

module.exports = async (sequelize) => {
  const tableName = 'questionType'

  try {
    const questionType = sequelize.define(
      tableName,
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        type: {
          type: DataTypes.STRING,
          allowNull: true,
          uniqe: true
        },
      }, {
      timestamps: true,
      tableName: tableName,
    },
    )
    questionType.associates = (models) => {
      questionType.hasMany(models.question, { foreignKey: 'question_type_id', allowNull: true });
    }
  } catch (exc) {
    console.log(exc);
    throw exc

  }
}