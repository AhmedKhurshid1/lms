const { DataTypes } = require('sequelize');


module.exports = async (sequelize) => {

    const tableName = 'admin'

    try {

        const admin = sequelize.define(
            tableName,
            {
                userId: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                emailAddress: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                },
                phoneNumber: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    unique: true
                },
                // employeeId: {
                //     type: DataTypes.STRING,
                //     allowNull: true,
                // },
                password: {
                    type: DataTypes.STRING,
                    // allowNull: false
                },
                
                user_role: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'role',
                        key: 'role_id'
                    }
                }
            },
            {
                timestamps: true,
                tableName: tableName,
                paranoid: true
            },
        );

        admin.associate = function (models) {
            admin.belongsTo(models.role, { foreignKey: 'user_role', allowNull: true });
            admin.hasMany(models.user, { foreignKey: 'created_by_id', allowNull: true });
            admin.hasMany(models.question, { foreignKey: 'teacher_id', allowNull: true });
            admin.hasMany(models.report, { foreignKey: 'teacher_id', allowNull: true });
              
        }

    } catch (exc) {
        console.log(exc);
        throw exc;
    }
}