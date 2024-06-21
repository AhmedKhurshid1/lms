const sequelize = require("sequelize");
const { DataTypes } = require('sequelize');

module.exports = async (sequelize) => {
  const tableName = 'question'

  try {
    const question = sequelize.define(
      tableName,
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        question: {
          type: DataTypes.STRING,
          allowNull: false,
          uniqe: true
        },
        question_type: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'questionType',
            key: 'id'
          }
        },
        teacher_Id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'users',
            key: 'userId'
          }
        }
      }, {
      timestamps: true,
      tableName: tableName,
    },
    )
    question.associates = (models) => {
      question.hasMany(models.answer, { foreignKey: 'question_id', allowNull: true });
      question.hasMany(models.report, { foreignKey: 'question_id', allowNull: true });
      question.belongsTo(models.questionType, { foreignKey: 'question_type_id', allowNull: true });
      question.belongsTo(models.admin, { foreignKey: 'teacher_id', allowNull: true });
      // question.belongsTo(models.user, { foreignKey: 'teacher_id', allowNull: true });
    }
  } catch (exc) {
    console.log(exc);
    throw exc

  }
}