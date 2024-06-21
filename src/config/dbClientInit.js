/** Core dependencies */
const util = require('util');

const debug = require('debug')('node-server:index');



const setupSequelize = async (sequelize, config) => {
    try {

        const {
            MSSQL_DB_NAME,
            MSSQL_DB_USER,
            MSSQL_DB_PASS,
            MSSQL_DB_HOST,
        } = config;

        const sequelizeInstqance = await new sequelize(
            MSSQL_DB_NAME,
            MSSQL_DB_USER,
            MSSQL_DB_PASS,
            {
                host: MSSQL_DB_HOST,
                port:3813,
                dialect: 'postgres',
                logging: false,
                pool: {
                    max: 30,
                    min: 0,
                    acquire: 100000,
                    idle: 10000,
                    evict: 10000,
                    handleDisconnects: true

                }

            }
        )

        const authenticated = await sequelizeInstqance.authenticate();

        return sequelizeInstqance;
    } catch (exc) {
        console.log(exc);
    }
}

const setupSequelizeTesting = async (sequelize, config) => {
    try {

        const {
            TEST_DB_NAME,
            TEST_DB_USER,
            TEST_DB_PASS,
            TEST_DB_HOST,
        } = config;

        const sequelizeInstqance = await new sequelize(
            TEST_DB_NAME,
            TEST_DB_USER,
            TEST_DB_PASS,
            {
                host: TEST_DB_HOST,
                dialect: 'postgres',
                logging: false
            }
        )

        const authenticated = await sequelizeInstqance.authenticate();

        return sequelizeInstqance;
    } catch (exc) {
        console.log(exc);
    }
}

module.exports = {
    setupSequelize,
    setupSequelizeTesting
}