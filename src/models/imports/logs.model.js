const {
    Sequelize,
    Model,
    DataTypes,
} = require('sequelize');

const {
    AppData
} = require('../../imports');


module.exports = async (sequelize) => {
    try {
        const Logs = sequelize.define(
            'Logs',
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        isIn: [Object.values(
                            AppData
                                .LogTypes
                        )]
                    }
                },
                endpoint: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                reason: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    defaultValue: null
                },
                method: {
                    type: DataTypes.STRING,
                    allowNull: false,
                }
            },
            {
                timestamps: true,
            },
        );
    } catch (exc) {
        console.log(exc);
        throw exc;
    }
}