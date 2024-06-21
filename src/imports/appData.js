module.exports = {
  business: {
    /** Business logic & Functional specifiers */ usersCapacity: 500,
    maxRequestsPerSecond: 4,
    acceptableDuration: 1000,
  },
  roles: {
    AppUser: "AppUser",
    Admin: "Admin",
    System: "System", // Genetec System
    Data: "Data", // Data Containers & Models
  },
  notificationType: {
    FOLLOW_REQUEST: 1,
    ON_OFF: 2,
    ACCEPT: 3,
  },
  Users: {
    status: {
      EMAIL_ADDED: 0,
      PHONE_VERIFIED: 1,
      WARNED: 2,
      BLOCKED: 3,
    },
    provider: {
      Google: "Google",
      Facebook: "FB",
      Cognito: "Cognito",
      Apple: "Apple",
    },
    role: {
      Admin: 1,
      User: 2,
    },
  },
  LogTypes: {
    Success: "Success",
    Error: "Error",
  },
  stripe: {
    logTypes: {
      Success: "Success",
      Failed: "Failed",
    },
  },
  AccessControl: {
    subscription: {
      approvedRoutes: [
        "/all",
        "/subscribePlan/:cardId",
        "/confirm_payment/:subscriptionId",
        "/subscribePlan",
        "/card/create",
        "/card/delete",
        "/cards",
        "/cards/update",
        "/logOut",
        "/verifyForgotPasswordOTP",
        "/resetPassword",
        "/complete-profile",
        "/resend/otp",
        "/verify/otp",
        "/verify/social/otp",
        "/allSignUp",
        "/subscribePlanSignUp",
        "/unSubscribe",
      ],
    },
  },
};
