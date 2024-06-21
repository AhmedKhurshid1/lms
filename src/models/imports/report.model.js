const sequelize = require("sequelize");
const { DataTypes } = require('sequelize');

module.exports = async (sequelize) => {
  const tableName = 'report'

  try {
    const report = sequelize.define(
      tableName,
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        teacher_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'admin',
            key: 'userId'
          }
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: 'users',
              key: 'userId'
            }
          },
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: 'question',
              key: 'id'
            }
        },
        answer_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'answers',
            key: 'id'
          }
        },
        marks: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            uniqe: true
        }
      }, {
      timestamps: true,
      tableName: tableName,
    },
    )
    report.associates = (models) => {
        report.belongsTo(models.admin, { foreignKey: 'teacher_id', allowNull: true });
        report.belongsTo(models.user, { foreignKey: 'student_id', allowNull: true });
        report.belongsTo(models.question, { foreignKey: 'question_id', allowNull: true });
        report.belongsTo(models.answers, { foreignKey: 'answer_id', allowNull: true });
    }
  } catch (exc) {
    console.log(exc);
    throw exc

  }
}