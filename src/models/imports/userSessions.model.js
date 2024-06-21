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
        const UserSessions = sequelize.define(
            'UserSessions',
            {
                sessionId: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'users', // name of the target model/table
                        key: 'userId'   // key in the target model/table
                    }
                },
                jwtToken: {
                    type: DataTypes.STRING(4000),
                    allowNull: true
                },
                firebaseToken: {
                    type: DataTypes.STRING(4000),
                    allowNull: true
                }
            },
            {
                timestamps: true,
                indexes: [
                    {
                        unique: true,
                        fields: ['userId']
                    },
                ]
            },
        );
    } catch (exc) {
        console.log(exc);
        throw exc;
    }
}