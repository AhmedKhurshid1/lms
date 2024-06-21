/** Local functions and dependencies */
const {
  createUser,
  loginUser,
  sendPasswordOTP,
  verifyOTPForgotPassword,
  changePassword,
  resendOTP,
  verifyOTP,
  decryptPassword,
  logOut,
  createAdmin,
  checktoken,
  getProfile
} = require("./users.service");

const { ErrorsFactory } = require("../../factories");
const sequelizeInstance = global.db;
const models = global.db?.models;
const { Response: response, signAndReturnJWT, CognitoClient } = require("../../libraries");
const { catchAsyncErrors } = require("../../imports/error.handlers");
const { updateDocument, createDocument, findDocument, findByJoin, hardDelete, searchByQuery, findByJoins, sendTwillioOTP } = require("../utils/queryFunctions");
const { safeAttributes, checkForEmptyStrings } = require("../../tests/helpers");
const moment = require("moment");
const { Op, Sequelize } = require('sequelize');
const { sendOTP } = require("./users.service");
const appData = require("../../imports/appData");
const { amazonSNS } = require("../../libraries/amazonSNS");
const {
  STRIPE_ACCESS_KEY,
  STRIPE_WEBHOOK_SECRET,
  RT_CHAT_URL,
  COMMUNICATION_CHANNEL_SECRET
} = require('../../config');
// const { updateDocument, createDocument, findDocument, hardDelete } = require('../modules/utils/queryFunctions');
const { _test } = require('@hapi/joi/lib/types/date');
// const Subscriptions = require('../plans/plans.service')

const stripe = require('stripe')(STRIPE_ACCESS_KEY);


const signup = catchAsyncErrors(async (req, res, next) => {
  const signedUpUser = await createUser(req);
  response(res, signedUpUser);
});

const adminSignup = catchAsyncErrors(async (req, res, next) => {
  const signedUpUser = await createAdmin(req);
  response(res, signedUpUser);
});

const login = catchAsyncErrors(async (req, res, next) => {
  const loggedInUser = await loginUser(req);
  response(res, loggedInUser);
});

const checkToken = catchAsyncErrors(async (req, res, next) => {
  const returnedUser = await checktoken(req);
  response(res, returnedUser);
});

const userProfile = catchAsyncErrors(async (req, res, next) => {
  const returnedUser = await getProfile(req);
  response(res, returnedUser);
});

const loggedOut = catchAsyncErrors(async (req, res, next) => {

  let { userId } = req.headers.User;
  await hardDelete("UserSessions", { userId });
  let apiResponse = { success: true, message: "User logged out" };
  response(res, apiResponse);

});

/**
 * Request otp for password recovery
 * @property {*} req.body.emailAddress - Email Address to reset pasword for
 * @returns {*} response - Details of job intialization
 */
const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  let result = await sendPasswordOTP(req);
  response(res, result);
});

/**
 * Verify otp and update password
 * @property {*} req.body.otp - OTP for resetting password
 * @returns {*} response - Details of job intialization
 */
const verifyOTPPassword = catchAsyncErrors(async (req, res, next) => {
  let result = await verifyOTPForgotPassword(req);
  response(res, result);
});

/**
 * Provide a new password with the verification code to have the password updated
 * @property {*} req.body.verificationCode - OTP for resetting password
 * @property {*} req.body.newPassword - new password to be set
 * @returns {*} response - Details of job intialization
 */
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const result = await changePassword(req);
  response(res, result);
});

const changeCurrentPassword = catchAsyncErrors(async (req, res, next) => {

  let { oldPassword, confirmNewPassword, newPassword } = req.body;

  let { emailAddress } = req.headers.User;

  emailAddress = emailAddress.toLowerCase();

  oldPassword = decryptPassword(oldPassword);
  newPassword = decryptPassword(newPassword);
  confirmNewPassword = decryptPassword(confirmNewPassword);

  if (newPassword != confirmNewPassword)
    throw new Error("PasswordNotMatch");

  if (newPassword === oldPassword)
    throw new Error("SamePasswords");
  try {
    await CognitoClient.Login({
      name: emailAddress,
      password: oldPassword,
    });
  }
  catch (e) {
    console.log(e);
    throw new Error('IncorrectOldPassword')

  }

  await CognitoClient.changePassword(newPassword, emailAddress);

  response(res, { success: true, message: "Password was changed successfully" });

});


const resendOtp = catchAsyncErrors(async (req, res, next) => {
  const signedUpUser = await resendOTP(req);

  response(res, signedUpUser);
});

const verifyOtp = catchAsyncErrors(async (req, res, next) => {
  const signedUpUser = await verifyOTP(req);
  response(res, signedUpUser);
});

const getAllUsers = catchAsyncErrors(async (req, res, next) => {

  // let { userId } = req.headers.User;
  // let {userId}= req.body;

  // Query
  let users = await findDocument('Users', {role: 2});

  let apiResponse = { success: true, users }
  response(res, apiResponse)

});



module.exports = {
  signup,
  login,
  forgotPassword,
  verifyOTPPassword,
  resetPassword,
  resendOtp,
  verifyOtp,
  loggedOut,
  changeCurrentPassword,
  getAllUsers,
  adminSignup,
  checkToken,
  userProfile
};
