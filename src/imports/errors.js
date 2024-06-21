/** Third party dependencies **/
const httpStatus = require('http-status');


const errors = {
    objects: {
        errorOccured: {
            message: "Error Occured!",
            status: httpStatus.INTERNAL_SERVER_ERROR
        },
        CantReviewWithoutTrip: {
            message: "Reviewee has no hosted trips.",
            status: httpStatus.BAD_REQUEST
        },
        CantFollowYourself: {
            message: "Can't follow yourself",
            status: httpStatus.BAD_REQUEST
        },
        CantReportSelf: {
            message: "Can't report yourself",
            status: httpStatus.BAD_REQUEST
        },
        CantUnFollowYourself: {
            message: "Can't unfollow yourself",
            status: httpStatus.BAD_REQUEST
        },
        AlreadyFollowed: {
            message: 'User already followed',
            status: httpStatus.BAD_REQUEST
        },
        AlreadySubscribed: {
            message: 'Already subscribed to a plan!',
            status: httpStatus.BAD_REQUEST
        },
        CardDetailsMissing: {
            message: 'Card details missing',
            status: httpStatus.BAD_REQUEST
        },
        NotSubscribed: {
            message: 'No Plan subscribed!',
            status: httpStatus.BAD_REQUEST
        },
        AlreadyExists: {
            message: 'Already Exists!',
            status: httpStatus.BAD_REQUEST
        },
        UserCantBeReviewee: {
            message: 'User can not review himself.',
            status: httpStatus.BAD_REQUEST
        },
        ErrorUpdating: {
            message: 'Error updating',
            status: httpStatus.BAD_REQUEST
        },
        ErrorCreating: {
            message: 'Error creating',
            status: httpStatus.BAD_REQUEST
        },
        AlreadyPublished: {
            message: 'Trip is already published.',
            status: httpStatus.BAD_REQUEST
        },
        NotAuthorizedException: {
            message: 'Invalid Credentials.',
            status: httpStatus.FORBIDDEN
        },
        UsernameExistsException: {
            message: 'User Already Exists!',
            status: httpStatus.CONFLICT
        },
        LoginError: {
            message: 'Cannot Login!',
            status: httpStatus.UNAUTHORIZED
        },
        NotFound: {
            message: 'Not Found!',
            status: 404,
        },
        EmailNotFound: {
            message: 'Email Not Found',
            status: httpStatus.BAD_REQUEST
        },
        UserNotFound: {
            message: 'User Not Found',
            status: httpStatus.BAD_REQUEST
        },
        DifferentProvider: {
            message: 'Account is registered from another provider (i.e: Google, Apple, Facebook).',
            status: httpStatus.BAD_REQUEST
        },
        AlreadyAccept: {
            message: 'already_accept_request',
            status: httpStatus.CONFLICT
        },
        Blocked: {
            message: 'User is blocked!',
            status: httpStatus.CONFLICT
        },
        AlreadyFollow: {
            message: 'Already Followed!',
            status: httpStatus.CONFLICT
        },
        FolloweeNotFound: {
            message: 'Followee Not Found!',
            status: httpStatus.BAD_REQUEST
        },
        InvalidOTP: {
            message: 'The OTP provided is incorrect',
            status: httpStatus.BAD_REQUEST
        },
        OTPExpired: {
            message: 'The OTP provided has expired',
            status: httpStatus.BAD_REQUEST
        },

        UserNotConfirmedException: {
            message: 'SignUp Flow is incomplete!',
            status: httpStatus.BAD_REQUEST
        },
        AlreadyExists: {
            message: 'Already Exists!',
            status: httpStatus.BAD_REQUEST
        },
        PasswordNotMatch: {
            message: 'Password and Confirm Password do not match',
            status: httpStatus.BAD_REQUEST
        },
        AccessForbidden: {
            message: 'Access Forbidden!',
            status: httpStatus.FORBIDDEN
        },
        AuthRequired: {
            message: 'Authorization Required!',
            status: httpStatus.FORBIDDEN
        },
        InvalidToken: {
            message: 'Invalid Token',
            status: httpStatus.FORBIDDEN
        },
        NotAuthorizedException: {
            message: 'Invalid Credentials.',
            status: httpStatus.FORBIDDEN
        },
        InvalidCredentials: {
            message: 'Invalid Credentials.',
            status: httpStatus.NOT_FOUND
        },
        TrialExpired: {
            message: 'Your session has expired. Please login again.',
            status: httpStatus.FORBIDDEN
        },
        MarkedSignin: {
            message: 'marked_signin',
            status: httpStatus.SERVICE_UNAVAILABLE
        },
        InvalidRequestBody: {
            message: 'invalid_request_fields',
            status: httpStatus.BAD_REQUEST
        },
        ValidationError: {
            message: 'Validation Error!',
            status: httpStatus.LENGTH_REQUIRED
        },
        Error: {
            message: 'Error',
            status: httpStatus.INTERNAL_SERVER_ERROR
        },
        TypeError: {
            message: 'type_error',
            status: httpStatus.PRECONDITION_FAILED
        },
        ReferenceError: {
            message: 'reference_error',
            status: httpStatus.GONE
        },
        MongoError: {
            message: 'error',
            status: httpStatus.INTERNAL_SERVER_ERROR
        },
        BookingExists: {
            message: 'Booking has already been made',
            status: httpStatus.BAD_REQUEST
        },
        BookingDoesNotExists: {
            message: 'No Booking with this id',
            status: httpStatus.BAD_REQUEST
        },
        AlreadyAddedToWishlist: {
            message: 'The trip specified has already been added to the wishlist',
            status: httpStatus.BAD_REQUEST
        },
        UserHostsTripWishList: {
            message: "You can't add a trip that you host yourself to your wishlist",
            status: httpStatus.BAD_REQUEST
        },
        UserHostsTripBooking: {
            message: "You can't book a trip that you host yourself",
            status: httpStatus.BAD_REQUEST
        },
        NotEnoughSlots: {
            message: "There aren't enough slots remaining",
            status: httpStatus.BAD_REQUEST
        },
        TripNotPublishedYet: {
            message: "The trip has not been published yet.",
            status: httpStatus.BAD_REQUEST
        },
        UserNotFound: {
            message: "User Not Found",
            status: httpStatus.BAD_REQUEST
        },
        IdMustBeInt: {
            message: "The ID parameter must be an integer",
            status: httpStatus.BAD_REQUEST
        },
        NoAccountWithEmail: {
            message: "No account has been registered with this email",
            status: httpStatus.BAD_REQUEST
        },
        ResetNotAllowed: {
            message: "Password reset not allowed",
            status: httpStatus.BAD_REQUEST
        },
        TripPrivate: {
            message: "You can't add private trips to your Wishlist",
            status: httpStatus.BAD_REQUEST
        },
        NoStripeProduct: {
            message: "No Stripe Product Exists, please create one.",
            status: httpStatus.BAD_REQUEST,
            role: 'Admin'
        },
        InvalidDates: {
            message: "Invalid Date Range!",
            status: httpStatus.BAD_REQUEST,
        },
        CantReduceSlots: {
            message: "You can only increase no. of slots!",
            status: httpStatus.BAD_REQUEST,
        },
        NotAllowedToSeed: {
            message: "Not allowed to Seed Database.",
            reason: "Incorrect Password",
            status: httpStatus.FORBIDDEN
        },
        ProvidePassword: {
            message: "Not allowed to Seed Database.",
            reason: "No Password provided.",
            status: httpStatus.FORBIDDEN
        },
        CognitoUserNotFound: {
            message: 'User does not exist in cognito user pool!',
            status: httpStatus.NOT_FOUND
        },
        ProvideEmail: {
            message: "Please provide an email to delete user.",
            status: httpStatus.NOT_FOUND
        },
        MultipleImages: {
            message: "Can only provide a single image!",
            status: httpStatus.BAD_REQUEST,
        },
        InvalidParams: {
            message: "Please provide a valid ID",
            status: httpStatus.BAD_REQUEST,
        },
        CantAddOwnWish: {
            message: "Can not add your own trip to wishlist!",
            status: httpStatus.BAD_REQUEST,
        },
        AlreadyReported: {
            message: "User is already reported!",
            status: httpStatus.BAD_REQUEST,
        },
        TripAlreadyReported: {
            message: "Trip is already reported!",
            status: httpStatus.BAD_REQUEST,
        },
        BlogAlreadyReported: {
            message: "Blog is already reported!",
            status: httpStatus.BAD_REQUEST,
        },
        InvalidPassword: {
            message: "Incorrect Password!",
            status: httpStatus.BAD_REQUEST,
        },
        InvalidCategoryId: {
            message: "Invalid Accommodation Category Id",
            status: httpStatus.BAD_REQUEST,
        },
        InvalidAccommodationId: {
            message: "Accommodation doesnot Exist",
            status: httpStatus.BAD_REQUEST,
        },
        InvalidTripId: {
            message: "Trip doesnot Exist",
            status: httpStatus.BAD_REQUEST,
        },
        UserBlocked: {
            message: "Your Account is Blocked. Please Contact Support!",
            status: httpStatus.BAD_REQUEST,
        },
        InvalidTripType: {
            message: "Invalid Trip Type Provided.",
            validTypes: ['Hosted', 'Booked'],
            status: httpStatus.BAD_REQUEST,
        },
        NoCardsForUser: {
            message: "No Cards Found!",
            status: httpStatus.NOT_FOUND,
        },
        InvalidTypeForTrip: {
            message: "Invalid Trip Type Provided.",
            validTypes: ['Public', 'Private'],
            status: httpStatus.BAD_REQUEST,
        },
        InvalidPublishRequestDays: {
            message: "Please complete days information before publishing the trip.",
            status: httpStatus.BAD_REQUEST,
        },
        EmailOrPhoneExists: {
            message: "Email or Phone number already exists!",
            status: httpStatus.BAD_REQUEST
        },
        InvalidPhoneNumber: {
            message: "Invalid Phone Nubmer!",
            status: httpStatus.BAD_REQUEST
        },
        PhoneAlreadyExists: {
            message: "Phone Number Already Exists!",
            status: httpStatus.BAD_REQUEST
        },
        AlreadyExistsWishList: {
            message: 'Trip Already Exists in Wish List!',
            status: httpStatus.BAD_REQUEST
        },
        SessionExpired: {
            message: 'Session Expired! Please log-in again.',
            status: httpStatus.FORBIDDEN
        },
        IncompleteSubscription: {
            message: 'Subscription is incomplete!',
            status: httpStatus.BAD_REQUEST
        },
        AlreadyUsedFree: {
            message: 'You have already used the free trial once!',
            status: httpStatus.BAD_REQUEST
        },
        TripHasMembers: {
            message: "You cannot delete this trip because members are associated with it.",
            status: httpStatus.BAD_REQUEST
        },
        TripDatePassed: {
            message: "Cannot book this trip as trip has already started!",
            status: httpStatus.BAD_REQUEST
        },
        TokenExpiry: {
            'jwt expired': 'SessionExpired',
        },
        InvalidPublishRequest: {
            message: "Please complete all steps before Publishing the trip!",
            status: httpStatus.NOT_ACCEPTABLE
        },
        EmailAlreadyExists: {
            message: "Email Already Registered!",
            status: httpStatus.BAD_REQUEST
        },
        AccessDenied: {
            message: "Access Denied. Please Subscribe to a Plan.",
            status: httpStatus.FORBIDDEN
        },
        SubscriptionExpired: {
            message: "Subscription Expired!. Please Renew or Subscribe to a Plan.",
            status: httpStatus.FORBIDDEN
        },
        UserBlocked: {
            message: "Your Account has been Blocked. Please contact support!",
            status: httpStatus.UNAUTHORIZED
        },
        SamePasswords: {
            message: "Old and New Passwords are same!",
            status: httpStatus.NOT_ACCEPTABLE
        },
        IncorrectOldPassword: {
            message: "Incorrect Current Password!",
            status: httpStatus.NOT_ACCEPTABLE
        },
        AlreadyBlocked: {
            message: "User is already blocked!",
            status: httpStatus.BAD_REQUEST
        },
        AlreadyUnBlocked: {
            message: "User is not blocked!",
            status: httpStatus.BAD_REQUEST
        },
        InvalidTypeForBlock: {
            message: "Invalid Type! Acceptable types are ['block','unblock']",
            status: httpStatus.NOT_ACCEPTABLE
        },
        CantBlockYourself: {
            message: "Invalid Request! You can not block yourself.",
            status: httpStatus.BAD_REQUEST
        },
        InvalidTypeForNotification: {
            message: "Invalid Type! Acceptable types are ['all','vip','standard']",
            status: httpStatus.NOT_ACCEPTABLE
        },
        InvalidTypeForCategory: {
            message: "Invalid Type! Acceptable types are ['reported','notReported','warned','blocked']",
            status: httpStatus.NOT_ACCEPTABLE
        },
        TripConvoAlreadyExists: {
            message: "Conversation for this trip already exists!",
            status: httpStatus.BAD_REQUEST
        },
        CantReportAdminBlog: {
            message: "You can not report an Admin Blog!",
            status: httpStatus.BAD_REQUEST
        }
    },
    types: [
        "ValidationError",
        "Error",
        "TypeError",
        'ReferenceError',
        'MongoError'
    ]
}

module.exports = errors;