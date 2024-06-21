const sequelize = require("sequelize");
const { DataTypes } = require('sequelize');

module.exports = async (sequelize) => {
  const tableName = 'answers'

  try {
    const answer = sequelize.define(
      tableName,
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        answer: {
          type: DataTypes.STRING,
          allowNull: true
        },
        question_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'question',
            key: 'id'
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
        correctAns: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        }

      }
    )
    answer.associate = (models) => {
      answer.hasMany(models.report, { foreignKey: 'answer_id', allowNull: true });
      answer.belongsTo(models.user, { foreignKey: 'student_id', allowNull: true });
      answer.belongsTo(models.question, { foreignKey: 'question_id', allowNull: true });

  }

} catch (exc) {
  console.log(exc);
  throw exc;
}
}