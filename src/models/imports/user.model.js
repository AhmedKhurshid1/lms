const { Sequelize, Model, DataTypes } = require("sequelize");

const { AppData } = require("../../imports");

module.exports = async (sequelize) => {
  const tableName = "users";

  try {
    const User = sequelize.define(
      tableName,
      {
        userId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        emailAddress: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phoneNumber: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
        },
        user_role: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            isIn: [Object.values(AppData.Users.role)],
          },
        },

        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isIn: [Object.values(AppData.Users.status)],
          },
        },
      },
      {
        timestamps: true,
        indexes: [
          {
            unique: false,
            fields: ["name"],
          },
        ],
      }
    );

    User.associate = function (models) {
      User.belongsTo(models.admin, {
        foreignKey: "created_by_id",
        allowNull: true,
      });
      // user.hasMany(models.question, {
      //   foreignKey: "teacher_id",
      //   allowNull: true,
      // });
      User.belongsTo(models.role, { foreignKey: "user_role", allowNull: true });
      User.hasMany(models.answer, {
        foreignKey: "student_id",
        allowNull: true,
      });
      User.hasMany(models.report, {
        foreignKey: "student_id",
        allowNull: true,
      });
    };
  } catch (exc) {
    console.log(exc);
    throw exc;
  }
};
