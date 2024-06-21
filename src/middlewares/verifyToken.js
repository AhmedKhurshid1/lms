var jwt = require('jsonwebtoken');

const {
    JWT_EXPIRES_IN,
    JWT_SECRET,
    APP_ID,
    APP_SECRET
} = require('../config');

const { promisify } = require("util");

const { Users: User, UserSessions } = global.db?.models;
const { signAndReturnJWT, verifyJWT } = require("./../libraries");

const { Op } = require('sequelize')

var request = require('request');
const { Response: response } = require('../libraries');
/** Local static objects & dependencies */
const { ErrorsFactory } = require('../factories');

const {
    verifyToken: AWSToken,
    verifyFbToken: FBToken,
    verifyGoogleToken: GoogleToken,
    verifyAppleToken: AppleToken
} = require('../libraries/cognitoClient');
const { result } = require('lodash');
const { findDocument } = require('../modules/utils/queryFunctions');
const errors = require('../imports/errors');
const { Errors } = require('../imports');
const { getThirdParty } = require('../imports/error.handlers');
const AccessControl = require('./AdditionalVerifiers');
const { ErrorReply } = require('redis');
const { Users } = global?.db.models;

// const verifyToken = async (req, res, next, options = {}) => {
//     const {
//         headers: {
//             authorization: bearerToken,
//         }
//     } = req;

//     /** As a service function option will allow using this middleware/controller
//      * as a service as a function within our application
//      */
//     const {
//         asAServiceFunction
//     } = options;

//     if (!req.headers.authorization) {
//         const authError = new Error('AuthRequired');

//         // if (asAServiceFunction)
//         //     throw authError;
//         console.log(authError);

//         response(res, authError, 403)
//     } else {
//         try {
//             var decoded = jwt.verify(
//                 bearerToken,
//                 JWT_SECRET
//             );

//             if (decoded) {
//                 if (!req.body)
//                     req.body = {};

//                 const { emailAddress } = decoded;

//                 let transaction = null;
//                 // if (req.method !== 'GET')
//                 //     transaction = await global?.db?.transaction()

//                 // if (emailAddress)
//                 //     req.body.emailAddress = emailAddress;

//                 Object.assign(
//                     req.headers,
//                     {
//                         decoded
//                     }
//                 );

//                 if (asAServiceFunction)
//                     return decoded;

//                 next();
//             } else {
//                 const invalidTokenError = new Error('InvalidToken');

//                 if (asAServiceFunction)
//                     throw invalidTokenError;

//                 response(res, invalidTokenError, 403);
//             }
//         } catch (err) {
//             const trialExpiredError = new Error('InvalidToken');

//             if (asAServiceFunction)
//                 throw trialExpiredError;

//             response(res, trialExpiredError, 403)
//         }
//     }

// };


// const verifyToken = async (req, res, next, options = {}) => {
//     const {
//         headers: {
//             authorization: bearerToken,
//         }
//     } = req;

//     /** As a service function option will allow using this middleware/controller
//      * as a service as a function within our application
//      */
//     const {
//         asAServiceFunction
//     } = options;

//     if (!req.headers.authorization) {
//         const authError = new Error('AuthRequired');

//         // if (asAServiceFunction)
//         //     throw authError;
//         console.log(authError);

//         response(res, authError, 403)
//     } else {
//         try {
//             var User = jwt.verify(
//                 bearerToken,
//                 JWT_SECRET
//             );

//             let doesExist = await global?.db.models.Users.findAll({ where: { userId: User?.userId } })
//             if (!doesExist?.length) throw new Error('InvalidToken')

//             // if (doesExist[0]?.status === 1) {
//             //     let userSession = await global?.db.models.UserSessions.findAll({ where: { jwtToken: bearerToken } })
//             //     if (!userSession?.length)
//             //         throw new Error('SessionExpired')
//             // }

//             if (User) {
//                 if (!req.body)
//                     req.body = {};

//                 const { emailAddress } = User;

//                 // if (emailAddress)
//                 //     req.body.emailAddress = emailAddress;
//                 let transaction = null;
//                 if (req.method !== 'GET')
//                     transaction = await global?.db?.transaction()
//                 Object.assign(
//                     req.headers,
//                     {
//                         User: doesExist[0]?.dataValues,
//                         transaction
//                     }
//                 );

//                 if (asAServiceFunction)
//                     return User;

//                 next();
//             } else {
//                 const invalidTokenError = new Error('InvalidToken');

//                 if (asAServiceFunction)
//                     throw invalidTokenError;

//                 response(res, invalidTokenError, 403);
//             }
//         } catch (err) {
//             let trialExpiredError = new Error('InvalidToken');

//             if (err.message == 'SessionExpired' || err.message == 'jwt expired')
//                 trialExpiredError = new Error(errors.objects.TokenExpiry[err.message]);

//             if (asAServiceFunction)
//                 throw trialExpiredError;

//             response(res, { message: trialExpiredError.message, status: 403 }, 403)
//         }
//     }

// };

const verifyToken = async (req, res, next, options = {}) => {

    const { headers: { authorization: bearerToken } } = req;

    const { asAServiceFunction } = options;

    try {

        if (!req.headers.authorization)
            throw new Error('AuthRequired');

        var { userId, ip } = verifyJWT(bearerToken, JWT_SECRET);
        if(ip != req.ip) throw new Error('InvalidToken')
        let User = await Users.findOne({ where: { userId }, raw: true })
        if (!User) throw new Error('InvalidToken')

        req.body = req.body || {}

        let transaction = null;
        if (req.method !== 'GET')
            transaction = await global?.db?.transaction()

        /* Aditional Verification Stack */

        // const verify = new AccessControl({ User, req })

        /* Block */
        // verify.blocked()

        // /* Subscription */
        // await verify.subscription()

        let extendedHeaders = { transaction, User }

        if (asAServiceFunction) return extendedHeaders

        Object.assign(
            req.headers,
            extendedHeaders
        );
        next();
    }
    catch (exc) {

        let { message } = exc;
        console.log("Here: ", { exc })
        let error = Errors.objects[message] || getThirdParty(exc) || Errors.objects['Error']
        response(res, error, error.status)

    }

}
const verifyAdminToken = async (req, res, next, options = {}) => {
    const {
        headers: {
            authorization: bearerToken,
        }
    } = req;

    /** As a service function option will allow using this middleware/controller
     * as a service as a function within our application
     */
    const {
        asAServiceFunction
    } = options;

    if (!req.headers.authorization) {
        const authError = new Error('AuthRequired');

        // if (asAServiceFunction)
        //     throw authError;
        console.log(authError);

        response(res, authError, 403)
    } else {
        try {
            var User = jwt.verify(
                bearerToken,
                JWT_SECRET
            );

            let doesExist = await global?.db.models.Admin.findAll({ where: { adminId: User?.adminId } })
            if (!doesExist?.length) throw new Error('InvalidToken')

            if (User) {
                if (!req.body)
                    req.body = {};

                const { emailAddress } = User;

                // if (emailAddress)
                //     req.body.emailAddress = emailAddress;
                let transaction = null;
                if (req.method !== 'GET')
                    transaction = await global?.db?.transaction()
                Object.assign(
                    req.headers,
                    {
                        User,
                        transaction
                    }
                );

                if (asAServiceFunction)
                    return User;

                next();
            } else {
                const invalidTokenError = new Error('InvalidToken');

                if (asAServiceFunction)
                    throw invalidTokenError;

                response(res, invalidTokenError, 403);
            }
        } catch (err) {
            const trialExpiredError = new Error('InvalidToken');

            if (asAServiceFunction)
                throw trialExpiredError;

            response(res, trialExpiredError, 403)
        }
    }

};

const verifyTokenCognito = async (req, res, next, options = {}) => {
    try {

        const {
            headers: {
                authorization: bearerToken,
                provider: loginProvider
            }
        } = req;

        /** As a service function option will allow using this middleware/controller
         * as a service as a function within our application
         */
        const {
            asAServiceFunction
        } = options;

        if (!req.headers.authorization || !req.headers.provider) {
            const authError = new Error('AuthRequired');

            if (asAServiceFunction)
                throw authError;

            response(res, authError, 403)
        } else {

            let email = await tokenEmail(bearerToken, loginProvider);
            if (!req.body)
                req.body = {};

            if (email) {
                let User = await checkUser(email, bearerToken);
                if (User) {
                    let transaction = null
                    if (req.method !== 'GET')
                        transaction = await global?.db.transaction()
                    Object.assign(
                        req.headers,
                        {
                            User,
                            transaction
                        }
                    );
                    next();
                    return;
                }
            }
            response(res, new Error('TrialExpired'), 403)
        }
    } catch (err) {
        response(res, new Error('TrialExpired'), 403)
    }
}

const verifyTokenSignUp = async (req, res, next, options = {}) => {

    const {
        headers: {
            authorization: bearerToken,
            provider: loginProvider
        }
    } = req;

    /** As a service function option will allow using this middleware/controller
     * as a service as a function within our application
     */
    const {
        asAServiceFunction
    } = options;

    if (!req.headers.authorization || !req.headers.provider) {
        const authError = new Error('AuthRequired');
        if (asAServiceFunction)
            throw authError;
        response(res, authError, 403)
    } else {
        try {
            console.log({ bearerToken })

            let result = await tokenEmailSignUp(bearerToken, loginProvider);

            if (!req.body)
                req.body = {};

            const { email } = result;

            // const accessToken = await getExtendedToken({ email });
            const accessToken = null;
            
            console.log({ bearerToken })

            Object.assign(
                req.headers,
                {
                    result,
                    authorization: accessToken || bearerToken
                }
            );

            next();

        } catch (err) {
            const trialExpiredError = new Error('TrialExpired');
            response(res, trialExpiredError, 403)
        }
    }

};
/**
 * Function specific to Facebook signup process
 * @param {*} url 
 * @returns 
 */
var getAPIresponse = function (url) {

    return new Promise((resolve, reject) => {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            } else {
                console.log("Error: " + error);
            }
            return resolve(body);
        });
    });
};

/**
 * Takes an AWSToken as a parameter and verifies it. If the token is valid, it decodes it to returns the user's email Address.
 * @param {*} bearerToken 
 * @returns User email address
 */
const tokenEmail = async (bearerToken, loginProvider) => {
    let promise = null;
    try {
        switch (loginProvider) {
            case "Cognito":
                promise = AWSToken(bearerToken, false);
                break;
            case "FB":
                promise = FBToken(bearerToken, false);
                break;
            case "Google":
            case "Apple":
                let newJWT = promisify(jwt.verify);
                promise = newJWT(
                    bearerToken,
                    JWT_SECRET
                );
                break;
        }
    } catch (err) {
        response(res, err, 403);
    }
    let data = await promise.then(
        result => {
            return result;
        },
        error => {
            response(res, error, 403);
        }
    );
    if (data) {

        let {
            email,
            emailAddress
        } = data

        return email || emailAddress;
    }
    response(res, new Error('InvalidToken'), 403);

}

/**
 * Takes an AWSToken as a parameter and verifies it. If the token is valid, it decodes it to returns the user's email Address.
 * @param {*} bearerToken 
 * @returns User email address
 */
const tokenEmailSignUp = async (bearerToken, loginProvider) => {
    let promise = null;
    try {
        switch (loginProvider) {
            case "Cognito":
                promise = AWSToken(bearerToken, false);
                break;
            case "FB":
                promise = FBToken(bearerToken, false);
                break;
            case "Google":
                promise = GoogleToken(bearerToken, false);
                break;
            case "Apple":
                promise = AppleToken(bearerToken);
                break;
        }
    } catch (err) {
        console.log(err.message)
        response(res, err, 403);
    }
    let result = await promise.then(
        result => result,
        error => {
            response(res, error, 403);
        }
    );

    if (result)
        return result;

    response(res, new Error('InvalidToken'), 403);
}


const getExtendedToken = async (email) => {

    try {
        let token = signAndReturnJWT({
            ...email
        });
        return token;
    } catch (err) {
        console.log(err.message);
        response(err, new Error('InvalidToken'), 403);
    }

}

const checkUser = async (email, jwtToken) => {
    const userQuery = {
        emailAddress: email,
        status: { [Op.not]: 0 }
    }

    let foundUser = await User.findOne({ where: userQuery });


    if (!foundUser) {
        throw new Error('InvalidToken');
    }


    let foundSession = await UserSessions.findOne({ where: { jwtToken } })
    if (!foundSession)
        throw new Error('TrialExpired')
    return foundUser;
}

const checkUserSignUp = async (email) => {
    const userQuery = {
        emailAddress: email
    }

    let foundUser = await User.findOne({ where: userQuery });
    return foundUser;
}

module.exports = {
    verifyToken,
    verifyTokenCognito,
    verifyTokenSignUp,
    verifyAdminToken
}