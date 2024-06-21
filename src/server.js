/** Third party dependencies. */

const express = require('express');

const logger = require('morgan');

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const compress = require('compression');

const methodOverride = require('method-override');

const cors = require('cors');

const nocache = require('nocache');


/** Local configuration exports & modules */
const { API_BASE } = require('./config');

const sequelizeInstance = require('./models');



/** Local static objects */
const config = { MSSQL_DB_HOST } = require('./config');


module.exports = async () => {

  if (MSSQL_DB_HOST)
    await sequelizeInstance();

  else if (TEST_DB_HOST)
    await sequelizeInstance();

  const { errorMiddleware } = require('./middlewares/errors.middleware');
  

  const app = express();

  if (config.NODE_ENV === 'development') {
    app.use(logger('dev'));
  }


  // parse body params and attache them to req.body
  app.use(bodyParser.json({
    limit: '50mb',
    verify: (req, res, buf) => {
      req.rawBody = buf
    }
  }));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(cookieParser());
  app.use(compress());
  app.use(methodOverride());

  // Disable Cache
  app.use(nocache());
  app.set('etag', false)
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // enable CORS - Cross Origin Resource Sharing
  app.use(cors());

  /** Local configuration exports & modules */
  const {
    router,
    rootRouter,
  } = require('./routes');
  // mount all routes on /api path
  app.use(API_BASE, router);
  app.use('/', rootRouter);
  app.use(errorMiddleware)

  return app;

}
