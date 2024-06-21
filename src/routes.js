/** Third party dependencies */
const express = require('express');


const router = express.Router(); // eslint-disable-line new-cap
const rootRouter = express.Router(); // eslint-disable-line new-cap

const admin = require('./modules/admin/admin.routes');
const users = require('./modules/users/users.routes');
const utils = require('./modules/utils/utils.routes');


const routeNotFoundHandler = (req, res, next) => {
    res
        .status(404)
        .send({ message: 'routenotfound' })
}

const healthCheckHandler = (req, res, next) => {
    res.send(200);
}



/** GET /health-check - zzzCheck service health */
router
    .get(
        '/health-check',
        (req, res, next) => res.send('OK')
    );


router.use('/admin', admin);
router.use('/users', users);
router.use('/utils', utils);



router
    .all(
        '*',
        routeNotFoundHandler
    );

/** Root router */
rootRouter
    .get(
        '/',
        healthCheckHandler,
    );

rootRouter
    .get(
        '/health-check',
        healthCheckHandler,
    );

rootRouter
    .all(
        '*',
        routeNotFoundHandler
    );

module.exports = {
    router,
    rootRouter,
};
