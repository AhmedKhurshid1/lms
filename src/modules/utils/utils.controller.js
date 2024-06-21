/** Local functions and dependencies */
const { SEED_Password } = require('../../config');
const { Response: response, CognitoClient, signAndReturnJWT } = require("../../libraries");
const { catchAsyncErrors } = require("../../imports/error.handlers");
const { deleteUser, getUser, fetchUser, fetchAdmin } = require("../../libraries/cognitoClient");
const sequelize = global?.db
const {
    Users: User,
    UserSessions: UserSessions,

} = global.db?.models;
const CryptoJS = require("crypto-js");
const { PASSWORD_DECRYPTION_KEY } = require('../../config');
const { firebaseNotifications, findDocument, sendTwillioOTP, hardDelete } = require('./queryFunctions');
const { messaging } = require('firebase-admin');
const { emptyS3Directory } = require('../../libraries/s3Client');
const { pdfOptions } = require('../../tests/constants');
const pdf = require("pdf-creator-node");
const fs = require("fs");
const shortid = require('shortid')
const path = require("path");
const { listProducts, retrievePrice } = require('../../libraries/stripe');
// let html = fs.readFileSync(path.join(__dirname, "../trips/trip.html"), "utf8");
// const { generatePDF } = require('../trips/trips.service');
const { amazonSNS } = require('../../libraries/amazonSNS');

const cognitoLogin = catchAsyncErrors(async (req, res, next) => {

    // let products = await listProducts('prod_NZ8U7i2f3OPt59')
    let { emailAddress, password } = req.body;
    emailAddress = emailAddress.trim().toLowerCase();
    let user = await User.findOne({ where: { emailAddress: emailAddress } });
    if (!user) throw new Error("UserNotFound");
    accessToken = await CognitoClient.Login({
        name: emailAddress,
        password,
    });
    accessToken = await signAndReturnJWT({ ...user.dataValues,
        ip: req.ip })
    response(res, { success: true, accessToken })

});


module.exports = {
    // syncTable,
    // seedDB,
    // deleteUsers,
    // deleteAdmins,
    // encrypt,
    // decrypt,
    // notificationTest,
    // deletes3Directory,
    // deleteUsersFromDB,
    cognitoLogin
};
