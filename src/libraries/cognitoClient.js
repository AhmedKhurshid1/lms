let AWS = require('aws-sdk');

const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    REGION,
    POOL_ID,
    TEST_POOL_ID,
    TEST_COGNITO_CLIENT_ID,
    COGNITO_CLIENT_ID,
    ADMIN_POOL_ID,
    COGNITO_ADMIN_CLIENT_ID
} = require('../config');

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const jwt = require('jsonwebtoken');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const appleSignin = require('apple-signin-auth');
// global.fetch = require('node-fetch');



const AWSConfiguration = {
    'aws_access_key_id': AWS_ACCESS_KEY_ID,
    'aws_secret_access_key': AWS_SECRET_ACCESS_KEY,
    'region': REGION
}


AWS.config.update(AWSConfiguration);

let poolData = null;

if (TEST_POOL_ID && process.env.NODE_ENV == 'test') {
    poolData = {
        UserPoolId: TEST_POOL_ID,
        ClientId: TEST_COGNITO_CLIENT_ID,
    };
} else {

    poolData = {
        UserPoolId: POOL_ID,
        ClientId: COGNITO_CLIENT_ID,
    };
}

const adminPoolData = {
    UserPoolId: ADMIN_POOL_ID,
    ClientId: COGNITO_CLIENT_ID,
};

const Login = (body, admin = false) => {
    const { name, password } = body;
    const authenticationData = {
        Username: name,
        Password: password
    };

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(admin ? adminPoolData : poolData);

    const userData = {
        Username: name,
        Pool: userPool
    }

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    return new Promise(function (resolve, reject) {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                const accesstoken = result.getIdToken().getJwtToken();
                resolve(accesstoken);
            },
            onFailure: (function (err) {
                reject(err);
            })
        })
    });
};

const getUser = (params) => {
    params.UserPoolId = poolData.UserPoolId;
    let cognitoISP = new AWS.CognitoIdentityServiceProvider({ region: AWSConfiguration.region });
    return new Promise(function (resolve, reject) {
        cognitoISP.adminGetUser(params, (err, data) => {
            if (err)
                reject(err)
            else
                resolve(data)
        })
    });
}

const fetchUser = async (params) => {
    params.UserPoolId = poolData.UserPoolId;
    let cognitoISP = new AWS.CognitoIdentityServiceProvider({ region: AWSConfiguration.region });
    return new Promise(function (resolve, reject) {
        cognitoISP.adminGetUser(params, (err, data) => {
            if (err)
                resolve({ success: false, err })
            else
                resolve({ success: true, data })
        })
    });

}

const fetchAdmin = async (params) => {
    params.UserPoolId = poolData.ADMIN_POOL_ID;
    let cognitoISP = new AWS.CognitoIdentityServiceProvider({ region: AWSConfiguration.region });
    return new Promise(function (resolve, reject) {
        cognitoISP.adminGetUser(params, (err, data) => {
            if (err)
                resolve({ success: false, err })
            else
                resolve({ success: true, data })
        })
    });

}

const confirmUser = (params, admin = false) => {
    params.UserPoolId = admin ? adminPoolData.UserPoolId : poolData.UserPoolId;
    let cognitoISP = new AWS.CognitoIdentityServiceProvider({ region: AWSConfiguration.region });
    // console.log("PARAMS",params,cognitoISP)
    return new Promise(function (resolve, reject) {
        cognitoISP.adminConfirmSignUp(params, (err, data) => {
            if (err)
                reject(err)
            resolve(data)
        })
    });
}

const signOut = (emailAddress) =>
    new Promise((resolve, reject) => {
        var params = {
            UserPoolId: POOL_ID, /* required */
            Username: emailAddress /* required */
        };
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
            region: AWSConfiguration.region
        })
        cognitoidentityserviceprovider.adminUserGlobalSignOut(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err)
            } else {
                resolve(data)
            }
        });
    });

const createUser = (email, password, attributeList, admin = false) => {
    attributeList = attributeList || [
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: 'email',
            Value: email,
        })]
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(admin ? adminPoolData : poolData);
    return new Promise(function (resolve, reject) {
        userPool.signUp(email, password, attributeList, null, function (err, result) {
            if (err) reject(err)
            else resolve(result)
        })
    });
}

const updateAttributes = async (params) => {
    let cognitoISP = new AWS.CognitoIdentityServiceProvider({ region: AWSConfiguration.region });
    await cognitoISP
        .adminUpdateUserAttributes(params)
        .promise()
}

const changePassword = async (password, username, admin = false) => {
    let cognitoISP = new AWS.CognitoIdentityServiceProvider({ region: AWSConfiguration.region });
    await cognitoISP.adminSetUserPassword({ 'Password': password, "Permanent": true, "Username": username, UserPoolId: admin ? adminPoolData.UserPoolId : poolData.UserPoolId }).promise()
}

const deleteUser = async (username, admin = false) => {
    let cognitoISP = new AWS.CognitoIdentityServiceProvider({ region: AWSConfiguration.region });
    await cognitoISP.adminDeleteUser({ "Username": username, UserPoolId: admin ? adminPoolData.UserPoolId : poolData.UserPoolId }).promise()
}

const logoutUser = (token) => {

    var params = {
        AccessToken: token /* required */
    };

    let cognitoISP = new AWS.CognitoIdentityServiceProvider({ region: AWSConfiguration.region });

    return new Promise(function (resolve, reject) {
        cognitoISP.globalSignOut(params, null, function (err, result) {
            if (err) reject(err)
            else resolve(result)
        })
    });

    // return  .promise();

}

const verifyToken = async (token, admin = false) => {

    return new Promise((resolve, reject) => {
        request({
            url: `https://cognito-idp.${AWSConfiguration.region}.amazonaws.com/${admin ? adminPoolData.UserPoolId : poolData.UserPoolId}/.well-known/jwks.json`,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let pems = {};
                const { keys } = body;
                for (let i = 0; i < keys.length; i++) {
                    //Convert each key to PEM
                    const {
                        kid,
                        n,
                        e,
                        kty
                    } = keys[i]
                    const jwk = { kty, n, e };
                    const pem = jwkToPem(jwk);
                    pems[kid] = pem;
                }
                //validate the token
                const decodedJwt = jwt.decode(token, { complete: true });
                if (!decodedJwt) {
                    reject(new Error('InvalidToken'));
                    return;
                }

                const kid = decodedJwt.header.kid;
                const pem = pems[kid];
                if (!pem) {
                    reject(new Error('InvalidToken'));
                    return;
                }

                jwt.verify(token, pem, function (err, payload) {
                    if (err) {
                        reject(new Error('InvalidToken'));
                        return;
                    } else {
                        resolve(payload);
                        return;
                    }
                });

            } else {
                reject(new Error('TrialExpired'));
                return;
            }
        });
    });


}

const verifyFbToken = (token) => {
    let promise = new Promise((resolve, reject) => {
        request({
            url: `https://graph.facebook.com/me?fields=id,email&access_token=${token}`,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                reject(new Error('TrialExpired'));
                return;
            }
        });
    });

    return promise;
}

const verifyGoogleToken = (token) => {
    let promise = new Promise((resolve, reject) => {
        request({
            url: `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                resolve(body);
                return;
            } else {
                reject(new Error('TrialExpired'));
                return;
            }
        });
    });

    return promise;
}

const verifyAppleToken = async (token) => {
    try {
        const body = await appleSignin.verifyIdToken(token)
        return body;
    } catch (err) {
        console.log(err);
        throw new Error('TrialExpired');
    }
}

module.exports = {
    Login,
    getUser,
    confirmUser,
    signOut,
    createUser,
    updateAttributes,
    changePassword,
    deleteUser,
    verifyToken,
    logoutUser,
    verifyFbToken,
    verifyGoogleToken,
    fetchUser,
    fetchAdmin,
    verifyAppleToken
}