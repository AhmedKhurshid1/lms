/** Local dependencies / Libraries */
const {
    Common: {
        readLineAsync,
        getGen,
    },
} = require('../libraries');



/** Third party dependencies */
const Bluebird = require('bluebird'); // eslint-disable-line no-global-assign
const { Sequelize } = require('sequelize');


/** Local statics & imports */
const {
    SeedData,
} = require('../imports');


/**
 * Pre requisite functions and configuration for application / web-server
 * @property {*} app - Express App
 * @property {*} config - Configuration object for applications
 * @returns {void}
 */
module.exports = (app, config) => {
    /** Global available definition for root
     * Though a bad practice, but boiler plate strategy for testing.
     */
    global['root'] = __dirname

    /**
     * Replacing promise by Bluebird
     */
    Object.assign(
        Promise.prototype,
        Bluebird
    );


    const {
        NODE_ENV,
        PORT,
        JWT_SECRET,
        JWT_EXPIRES_IN,
        SOCKET_IO_REDIS_PORT,
        REDIS_DB_NO,
    } = config;


}