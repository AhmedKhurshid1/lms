const { DataTypes } = require('sequelize');


module.exports = async (sequelize) => {

    const tableName = 'role'
    try {
        const role = sequelize.define(
            tableName,
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                role_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    unique: true
                },
            },
            {
                timestamps: true,
                tableName: tableName
            },
        );

        role.associate = (models) => {
            role.hasMany(models.user, { foreignKey: 'user_role', allowNull: true });
            role.hasMany(models.admin, { foreignKey: 'user_role', allowNull: true });
        }

    } catch (exc) {
        console.log(exc);
        throw exc;
    }
}