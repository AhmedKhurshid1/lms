const { promisify } = require("util");
const redis = require('redis');

const redisClient = redis.createClient();

const redisErrorHandler = (error) => {
    console.log(error);
}

redisClient.on('error', redisErrorHandler);

const getValue = promisify(redisClient.get).bind(redisClient);
const setValue = promisify(redisClient.set).bind(redisClient);

module.exports = {
    getValue,
    setValue,
    instance: redisClient
};