/** Core Nodejs dependencies */
const path = require('path');


/** Third party dependencies */
const Joi = require('joi');

const dotenv = require('dotenv');


/** Application static objects */
const bullConfig = require('./bull');

const {
  appConfig: {
    defaultEnvironment,
    allowedEnvironments
  }
} = require('./appConfig');

const nodeEnvValidator = Joi.string()
  .allow(...allowedEnvironments)
  .default(defaultEnvironment);

const currentEnvironment = process.NODE_ENV || defaultEnvironment;

// require and configure dotenv, will load vars in .env.* file in PROCESS.ENV
const envFilePath = path.resolve(__dirname, '..', '..', `.env.${currentEnvironment}`);

let envConfig = dotenv.config({ path: envFilePath });

if ('NODE_ENV' in envConfig) {
  envConfig = process.env;
}

const {
  error: envFileError,
  parsed: parsedEnvVars,
} = envConfig;

/** Throwing error if incorrect file is not */
if (envFileError)
  throw new Error(`Environment file config error: ${envFileError}`);

const envValidator = Joi.object(
  {
    NODE_ENV: nodeEnvValidator,
    PORT: Joi.number()
      .default(4040),
    API_BASE: Joi.string().default('/api'),
    JWT_SECRET: Joi.string().required()
      .description('JWT Secret required to sign'),
    JWT_EXPIRES_IN: Joi.number().default(1440)
      .description('JWT expiration time in seconds'),
    // SALT_ROUNDS: Joi.number().required(),
    MONGOOSE_DEBUG: Joi.boolean()
      .when('NODE_ENV', {
        is: Joi.string().equal('development'),
        then: Joi.boolean().default(true),
        otherwise: Joi.boolean().default(false),
      }),
    MONGO_HOST: Joi.string()
      // .required()
      .description('Mongo DB host url'),
    MONGO_PORT: Joi.number()
      .default(27017),
    MSSQL_DB_NAME: Joi
      .string(),
    MSSQL_DB_USER: Joi
      .string(),
    MSSQL_DB_PASS: Joi
      .string(),
    MSSQL_DB_HOST: Joi
      .string(),
    SOCKET_IO_REDIS_PORT: Joi.number(),
    REDIS_DB_NO: Joi.number(),
    AWS_ACCESS_KEY_ID: Joi.string()
      // .required()
      .description('AWS ACCESS KEY required'),
    AWS_SECRET_ACCESS_KEY: Joi.string()
      // .required()
      .description('AWS SECRET ACCESS KEY required'),
    REGION: Joi.string()
      // .required()
      .description('REGION required'),
    POOL_ID: Joi.string()
      // .required()
      .description('POOL ID required'),
    ADMIN_POOL_ID: Joi.string(),
    COGNITO_CLIENT_ID: Joi.string()
      // .required()
      .description('COGNITO CLIENT ID required'),
    COGNITO_CLIENT_SECRET: Joi.string()
      // .required()
      .description('COGNITO CLIENT SECRET required'),
    S3_BUCKET: Joi.string()
      // .required()
      .description('S3 BUCKET required'),
    MESSAGEBIRD_APIKEY: Joi.string().description('EMAIL API KEY required'),
    SEED: Joi.boolean().required(),
    // STRIPE_ACCESS_KEY: Joi.string().required(),
    // STRIPE_WEBHOOK_SECRET: Joi.string().required(),
    // PASSWORD_DECRYPTION_KEY: Joi.string().required(),
    // SEED_Password: Joi.string().required(),
    // OTPExpirationMinutes: Joi.number().required(),
    // OTPExpirationSeconds: Joi.number().required(),
    // COMMUNICATION_CHANNEL_SECRET: Joi.string().required(),
    // RT_CHAT_URL: Joi.string().required()
  }
)
  .unknown()
  .required()


// validating current environemnt
const { error: envError, value } = envValidator.validate(
  parsedEnvVars
);

/** Throwing error if incorrect environment file is provided */
if (envError)
  throw new Error(`Environment validation error: ${envError.message}`);


const config = {
  ...parsedEnvVars,
  bullConfig
};


module.exports = config;
