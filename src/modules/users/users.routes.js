/** Third party dependencies*/
const { Router } = require('express');


/** Local dependencies and functions */
const {
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
    // getUserProfile
} = require('./users.controller');

const {
    verifyToken,
    schemaValidator,
    verifyTokenCognito,
    verifyTokenSignUp,
} = require('../../middlewares');
const { authorizedRoles } = require('../../middlewares/authorizedRoles');
const appData = require('../../imports/appData');
let admin= appData.Users.role.Admin;



const router = Router();


/** 
 * @todo - create a SaaS Stretegy for Yard Events API as a SaaS or Paas
 * Unmounted the signup route for Yard Events API distribution to be provided to TGS, solution
 * customized for Genetec.
 */
router
    .post(
        '/signup',
        schemaValidator('signupPayload'),
        signup,
    )
    .post(
        '/login',
        schemaValidator('loginPayload'),
        login,
    )
    .post(
        '/logOut',
        verifyToken,
        loggedOut
    )
    .post(
        '/forgotPassword',
        schemaValidator('forgotPassword'),
        forgotPassword,
    )
    .post(
        '/verifyForgotPasswordOTP',
        verifyToken,
        schemaValidator('OTP'),
        verifyOTPPassword,
    )
    .post(
        '/resetPassword',
        verifyToken,
        schemaValidator('resetPassword'),
        resetPassword,
    )
    .put(
        '/changePassword',
        verifyToken,
        schemaValidator('changePassword'),
        changeCurrentPassword,
    )

router
    .put(
        '/resend/otp',
        verifyToken,
        resendOtp,
    )
    .put(
        '/verify/otp',
        schemaValidator('OTP'),
        verifyToken,
        verifyOtp,
    )
    .get(
        '/getAllUsers',
        // schemaValidator('OTP'),
        verifyToken,
        authorizedRoles(admin),
        getAllUsers,
    )
    .post(
        '/signup/Admin',
        schemaValidator('signupPayload'),
        adminSignup,
    )
    .post(
        '/checkToken',
        verifyTokenSignUp,
        checkToken
    )
    .get(
        '/getUserProfile',
        // schemaValidator('OTP'),
        verifyToken,
        userProfile,
    )



module.exports = router;
