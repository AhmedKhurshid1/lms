/** Asynchronouse Application flow */
(async () => {
    /** Setting off Express Application Handling App */
    const app = await require('./src/server')();


    /** Application prerequisite startup functions & Config integration */
    const preReq = require('./src/config/preReq');    /** Application Statics */

    const appConfig = require('./src/config');

    await preReq(app, appConfig);

    app.listen(appConfig.PORT, () => { });
})();