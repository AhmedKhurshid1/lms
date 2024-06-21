/** Third party dependencies */
const _ = require('lodash');

const jwt = require('jsonwebtoken');


/** Local static exports & configuration */
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');
const { Errors } = require('../imports');


/**
 * Generate a signed token
 * @param {(Object|string)} data Object or string to hash
 * @return {Promise} A promise that resolves to the hashed string
 */
const signAndReturnJWT = (data) => {

    return jwt.sign(
        data,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

};

const verifyJWT = (bearerToken, JWT_SECRET) => {

    try {
        let User = jwt.verify(bearerToken, JWT_SECRET);
        return User
    }
    catch (exc) {
        let { message } = exc;
        console.log({ message })
        let expiryMessage = Errors.objects.TokenExpiry[message]
        let error = new Error(expiryMessage || 'InvalidToken')
        throw error
    }

}

module.exports = { signAndReturnJWT, verifyJWT };
