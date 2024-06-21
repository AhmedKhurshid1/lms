const Common = require('./common');
const Generate = require('./generateJWT');
const Response = require('./response');
// const RedisClient = require('./redisClient');
const CognitoClient = require('./cognitoClient');
const s3Client = require('./s3Client');

module.exports = {
    Common,
    ...Generate,
    Response,
    // RedisClient,
    CognitoClient,
    s3Client
}