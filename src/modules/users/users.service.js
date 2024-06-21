/** Third party dependencies*/
const _ = require("lodash");

const bcrypt = require("bcrypt");

const { signAndReturnJWT, Common, CognitoClient, Response: response } = require("../../libraries");

const { sendSMS } = require("./../../libraries/sms");
const { PASSWORD_DECRYPTION_KEY, OTPExpirationMinutes, OTPExpirationSeconds } = require('../../config');
const CryptoJS = require("crypto-js");
const { Op } = require('sequelize')
const {
  AppData: { roles, Users },
} = require("../../imports");

//const User=require('../../models/imports/users.model')
const {
  users: User,
  UserSessions: UserSessions,

} = global.db?.models;


const sequelizeInstance = global.db;

const {
  findDocument,
  createDocument,
  findDocumentWithAttributes,
  updateDocument,
  hardDelete,
  findByJoin,
  findByJoins
} = require("../utils/queryFunctions");

/** Local static objects & dependencies */
const {
  AppData: { business },
  Errors: { objects: ErrorsObjects },
} = require("../../imports");

const { SALT_ROUNDS, FORGOT_EXPIRY } = require("../../config");
const { update } = require("lodash");
const { number } = require("joi");
const { catchAsyncErrors } = require("../../imports/error.handlers");
const { safeAttributes } = require("../../tests/helpers");
const { fetchUser, deleteUser } = require("../../libraries/cognitoClient");
const { amazonSNS } = require("../../libraries/amazonSNS");
// const { Response: response, signAndReturnJWT } = require("../../libraries");

/**
 * create  user
 * @property {string} req.body.emailAddress - Email of the user.
 * @property {string} req.body.firstName - FirstName of the user.
 * @property {string} req.body.lastName - LastName of the user.
 * @property {string} req.body.password - Password set by user.
 * @property {string} req.body.company - Workplace / employer of user.
 * @property {string} req.body.profession - Profession user.
 * @returns {User} response - Void or Response
 */
const createUser = async (req) => {
  
  let { emailAddress, password, name, phoneNumber, role=Users.role.User, ...rest } = req.body;


  emailAddress = emailAddress.trim().toLowerCase();

  // password = decryptPassword(password);

  const decryptPassword = (text) => {
    if (!text) {
      throw new Error('Text to decrypt is undefined or null');
    }
  
    try {
      const temp = CryptoJS.AES.decrypt(text, PASSWORD_DECRYPTION_KEY);
      const decrypted = temp.toString(CryptoJS.enc.Utf8);
  
      if (!decrypted) {
        throw new Error('Decryption returned an empty string');
      }
  
      return decrypted;
    } catch (error) {
      console.error('Error during decryption:', error.message);
      throw error;
    }
  };

  let instanceToCreate = {
    emailAddress,
    password,
    name,
    phoneNumber,
    status: Users.status.EMAIL_ADDED,
    // profilePicURL: 'https://roam-trip-bucket.s3.us-east-2.amazonaws.com/Utils/default-user.png',
    // provider: "Cognito",
    user_role:Users.role.User,
    emailAddress,
  };

  /* Check for Exisitng Email */
  let foundUser = await findDocument('users', { emailAddress, raw: true })

  if (foundUser) {
    if (foundUser.status >= Users.status.PHONE_VERIFIED)
      throw new Error("EmailAlreadyExists");
    await hardDelete('users', { emailAddress })
    // let cognitoUser = await CognitoClient.fetchUser({ Username: emailAddress })
    // if (cognitoUser.success)
    //   await CognitoClient.deleteUser(emailAddress);
  }
  /* Check for Exisitng PhoneNumber */
  let foundPhoneNumber = await findDocument('users', { phoneNumber: instanceToCreate.phoneNumber, raw: true })
  
  if (foundPhoneNumber) {
    if (foundPhoneNumber.status >= Users.status.PHONE_VERIFIED)
  
      throw new Error("PhoneAlreadyExists");
    await hardDelete('users', { phoneNumber: instanceToCreate.phoneNumber })
  //   let cognitoUser = await CognitoClient.fetchUser({ Username: emailAddress })
  //   if (cognitoUser.success)
  //     await CognitoClient.deleteUser(emailAddress);
  };

  // let updatedData = await sendOTP(instanceToCreate);
  // instanceToCreate.OTP = updatedData.OTP;
  // instanceToCreate.OTPExpiration = updatedData.OTPExpiration;
  
  const t = await sequelizeInstance.transaction();
  let userDocument = {};
  let createdUserEmail = null;
  try {
  
    userDocument = await User.create(instanceToCreate, { transaction: t });
//     const createUser = async (instanceToCreate, transaction) => {
//       try {
//         const userDocument = await User.create(instanceToCreate, { transaction });
//         return userDocument;
//       } catch (error) {
//         console.error('Error creating user:', error);
//         throw error;
//       }
//     };

    accessToken = signAndReturnJWT({
      ...userDocument.dataValues,
    });

    // await CognitoClient.createUser(emailAddress, password);
    // createdUserEmail = emailAddress
    // if (userDocument?.dataValues?.phoneNumber)
    //   await amazonSNS({
    //     otp: updatedData?.OTP,
    //     phoneNumber: userDocument?.dataValues?.phoneNumber,
    //     name: userDocument?.dataValues?.name,
    //     emailAddress
    //   })
    await t.commit();
  } catch (err) {
    await t.rollback();
    if (createdUserEmail) {
      let user = await fetchUser({ Username: createdUserEmail });
      if (user.success)
        await deleteUser(createdUserEmail);
    }
    throw err;
  }
  // delete userDocument?.dataValues.OTP
  // delete userDocument?.dataValues.OTPExpiration
  // return { accessToken, userDocument };
  return { accessToken };
};

/**
 * Login Administrator
 * @property {string} req.body.emailAddress - Email of the user.
 * @property {string} req.body.password - Password set by user.
 * @property {string} req.body.role - Role to register user for
 * @returns {User} response - Void or Response
 */
//----- use cognitoLogin API, get the access token, use that here for login-----
const loginUser = async (req) => {

  let { authorization } = req.headers;

  // console.log(req.headers,{authorization})
  // let {email, password}= result;
  // console.log({email})

  let { emailAddress, password } = req.body;

  // console.log({emailAddress})
  emailAddress = emailAddress.trim().toLowerCase();

  let user = await User.findOne({ where: { emailAddress: emailAddress } });
  if (!user) throw new Error("UserNotFound");

  // accessToken = await CognitoClient.Login({
  //     name: emailAddress,
  //     password,
  // });

  accessToken = await signAndReturnJWT({ ...user.dataValues });
  // let {userId}= {accessToken}
  // console.log(userId)
  // console.log({ accessToken })

  let userSessionInstance = {
    jwtToken: accessToken,
    // firebaseToken: firebaseToken,
  };

  let foundSession = await findDocument("UserSessions", {userId: user.userId });

  if (foundSession) {

    await updateDocument("UserSessions", userSessionInstance, { userId: user.userId });
  } else if (!foundSession) {

    userSessionInstance.userId = user.userId;
    await createDocument("UserSessions", userSessionInstance);
  }
  return { success: true, accessToken };

};

const checktoken = async (req) => {

  // let { result, provider, firebasetoken, authorization } = req.headers;
  let { result, authorization } = req.headers;
  console.log(req.headers)
  // const firebaseToken = firebasetoken;
  let { email } = result;
  if (!email) throw new Error("UserNotFound");
  email = email.toLowerCase();

  let userQuery = {
    emailAddress: email,
  };

  let foundUser = await User.findOne({ where: userQuery });
  if (foundUser) {
    if (foundUser?.status >= Users.status.PHONE_VERIFIED)
      if (foundUser?.provider) {
        if (foundUser?.provider == provider) {
          authorization = signAndReturnJWT({
            ...foundUser.dataValues
          });
          // if (firebaseToken) {
          if (foundUser.status == Users.status.BLOCKED)
            throw new Error("UserBlocked")
          // delete session and then create new
          await hardDelete("UserSessions", { userId: foundUser.userId });
          await createDocument("UserSessions", {
            firebaseToken: firebaseToken || null,
            jwtToken: authorization,
            userId: foundUser.userId,
          });
          return { login: true, foundUser, accessToken: authorization };
        } else throw new Error("DifferentProvider");
      }
    await hardDelete('Users', userQuery);
  }

  foundUser = await User.create({ ...userQuery, provider, status: Users.status.EMAIL_ADDED });
  accessToken = signAndReturnJWT({
    ...foundUser.dataValues,
  });

  let userSessionInstance = {
    userId: foundUser.userId,
    jwtToken: accessToken,
    firebaseToken: firebaseToken,
  };

  await createDocument("UserSessions", userSessionInstance);

  return { accessToken, foundUser, login: false };
};

const sendPasswordOTP = async (req) => {
  let { emailAddress } = req.body;
  emailAddress = emailAddress.toLowerCase();

  let foundUser = await User.findOne({ where: { emailAddress } });

  if (!foundUser) {
    throw new Error("NoAccountWithEmail");
  }

  let updatedData = await sendOTP(foundUser);

  await User.update(updatedData, {
    where: { userId: foundUser.dataValues.userId },
  });

  foundUser = await User.findOne({ where: { emailAddress } });

  if (foundUser?.dataValues?.phoneNumber)
    await amazonSNS({
      otp: updatedData?.OTP,
      phoneNumber: foundUser?.dataValues?.phoneNumber,
      name: foundUser?.dataValues?.name,
      emailAddress: foundUser?.dataValues?.emailAddress
    })

  accessToken = signAndReturnJWT({
    ...foundUser.dataValues,
    codeVerified: false,
  });

  return { accessToken, OTP: foundUser.dataValues.OTP };
};

const verifyOTPForgotPassword = async (req) => {
  const { OTP } = req.body;

  let { emailAddress, codeVerified } = req.headers.User;
  emailAddress = emailAddress.toLowerCase();

  let foundUser = await User.findOne({ where: { emailAddress } });

  // if (codeVerified) throw new Error("AccessForbidden");

  if (OTP != foundUser.dataValues.OTP) throw new Error("InvalidOTP");

  if (foundUser.dataValues.OTPExpiration < new Date())
    throw new Error("OTPExpired");

  // await User.update(updatedData, {
  //   where: { userId: foundUser.dataValues.userId },
  // });

  foundUser = await User.findOne({ where: { emailAddress } });

  accessToken = signAndReturnJWT({
    ...foundUser.dataValues,
    codeVerified: true,
  });

  return { accessToken };
};

const changePassword = async (req) => {
  let { password, confirmPassword } = req.body;

  let { emailAddress, codeVerified } = req.headers.User;
  emailAddress = emailAddress.toLowerCase();

  if (password != confirmPassword) throw new Error("PasswordNotMatch");

  let foundUser = await User.findOne({ where: { emailAddress } });

  // if (!codeVerified) throw new Error("AccessForbidden");

  if (!foundUser) throw new Error("NotFound");

  await CognitoClient.changePassword(password, emailAddress);

  return { message: "Password was changed successfully" };
};


const sendOTP = async (user) => {
  let updatedData = {
    OTP: (Common.random(6))?.toString(),
    OTPExpiration: new Date(new Date().getTime() + OTPExpirationMinutes * OTPExpirationSeconds),
  };

  // if (user?.phoneNumber)
  //   await sendTwillioOTP({
  //     phoneNumber: user?.phoneNumber,
  //     otp: updatedData?.OTP
  //   })

  return updatedData;
};

/**
 * Resend OTP
 */
const resendOTP = async (req) => {
  let { emailAddress } = req.headers.User;
  emailAddress = emailAddress.toLowerCase();
  let userQuery = {
    emailAddress,
    status: Users.status.EMAIL_ADDED,
  };

  let foundUser = await User.findOne({ where: userQuery });

  if (!foundUser) throw new Error("NotFound");

  let updatedData = await sendOTP(foundUser);

  await User.update(updatedData, {
    where: { userId: foundUser.dataValues.userId },
  });

  await amazonSNS({
    otp: updatedData?.OTP,
    phoneNumber: foundUser?.dataValues?.phoneNumber,
    name: foundUser?.dataValues?.name,
    emailAddress: foundUser?.dataValues?.emailAddress
  })

  delete userQuery["status"];
  foundUser = await User.findOne({ where: userQuery, attributes: safeAttributes.user });

  accessToken = signAndReturnJWT({
    ...foundUser.dataValues,
  });

  return { accessToken, foundUser };
};

/**
 * Verify OTP
 */
const verifyOTP = async (req) => {
  const { OTP } = req.body;
  let {emailAddress} = req.headers.User;
  emailAddress = emailAddress.toLowerCase();
  let updatedData = {
    status: Users.status.PHONE_VERIFIED,
    OTP: null,
    OTPExpiration: null
  };

  let userQuery = {
    emailAddress,
  };

  let foundUser = await User.findOne({ where: userQuery });

  if (!foundUser) throw new Error("NotFound");

  if (foundUser.OTP != OTP) throw new Error("InvalidOTP");

  await CognitoClient.confirmUser({ Username: emailAddress });
  foundUser = await User.update(updatedData, {
    where: { userId: foundUser.userId },
  });

  // let location = await createDocument('Location', { userId })
  delete userQuery["status"];
  foundUser = await User.findOne({ where: userQuery });

  accessToken = signAndReturnJWT({
    ...foundUser.dataValues,
  });

  return { accessToken, foundUser: { ...foundUser.dataValues } };
};

const logOut = async (req) => {

  let { userId } = req.headers.User;
  await hardDelete("UserSessions", { userId });
  return { success: true, message: "User logged out" };

};

const decryptPassword = (text) => {
  let temp = CryptoJS.AES.decrypt(text, PASSWORD_DECRYPTION_KEY);
  let decrypted = temp.toString(CryptoJS.enc.Utf8);
  return decrypted;
};

const createAdmin = async (req) => {
  let { emailAddress, password, name, phoneNumber, role=Users.role.Admin, ...rest } = req.body;

  emailAddress = emailAddress.trim().toLowerCase();

  password = decryptPassword(password);

  let instanceToCreate = {
    emailAddress,
    name,
    phoneNumber,
    status: Users.status.EMAIL_ADDED,
    profilePicURL: 'https://roam-trip-bucket.s3.us-east-2.amazonaws.com/Utils/default-user.png',
    provider: "Cognito",
    role
    // status: role === Users.role.Admin ? Users.status.PHONE_VERIFIED : Users.status.EMAIL_ADDED,
  };

  let userQuery = {
    emailAddress,
  };


  /* Check for Exisitng Email */
  let foundUser = await findDocument('Users', { emailAddress, raw: true })
  if (foundUser) {
    if (foundUser.status >= Users.status.PHONE_VERIFIED)
      throw new Error("EmailAlreadyExists");
    await hardDelete('Users', { emailAddress })
    let cognitoUser = await CognitoClient.fetchUser({ Username: emailAddress })
    if (cognitoUser.success)
      await CognitoClient.deleteUser(emailAddress);
  }

  /* Check for Exisitng PhoneNumber */
  let foundPhoneNumber = await findDocument('Users', { phoneNumber: instanceToCreate.phoneNumber, raw: true })
  if (foundPhoneNumber) {
    if (foundPhoneNumber.status >= Users.status.PHONE_VERIFIED)
      throw new Error("PhoneAlreadyExists");
    await hardDelete('Users', { phoneNumber: instanceToCreate.phoneNumber })
    let cognitoUser = await CognitoClient.fetchUser({ Username: emailAddress })
    if (cognitoUser.success)
      await CognitoClient.deleteUser(emailAddress);
  }

  let updatedData = await sendOTP(instanceToCreate);
  instanceToCreate.OTP = updatedData.OTP;
  instanceToCreate.OTPExpiration = updatedData.OTPExpiration;

  const t = await sequelizeInstance.transaction();
  let userDocument = {};
  let createdUserEmail = null;
  try {
    userDocument = await User.create(instanceToCreate, { transaction: t });
    accessToken = signAndReturnJWT({
      ...userDocument.dataValues,
    });
    await CognitoClient.createUser(emailAddress, password);
    createdUserEmail = emailAddress
    if (userDocument?.dataValues?.phoneNumber)
      await amazonSNS({
        otp: updatedData?.OTP,
        phoneNumber: userDocument?.dataValues?.phoneNumber,
        name: userDocument?.dataValues?.name,
        emailAddress
      })
    await t.commit();
  } catch (err) {
    await t.rollback();
    if (createdUserEmail) {
      let user = await fetchUser({ Username: createdUserEmail });
      if (user.success)
        await deleteUser(createdUserEmail);
    }
    throw err;
  }
  // delete userDocument?.dataValues.OTP
  delete userDocument?.dataValues.OTPExpiration
  return { accessToken, userDocument };
};

const getProfile = async (req) => {

  let { userId } = req.headers.User;
  let user = await findDocument("Users", { userId }, "check");
  return user;

};

module.exports = {
  createUser,
  loginUser,
  checktoken,
  sendPasswordOTP,
  verifyOTPForgotPassword,
  changePassword,
  resendOTP,
  verifyOTP,
  sendOTP,
  logOut,
  decryptPassword,
  createAdmin,
  getProfile
};
