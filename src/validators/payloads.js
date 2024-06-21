/** Third party dependencies */
const { string } = require('joi');
const joi = require('joi');
joi.objectId = require('joi-objectid')(joi)

const {
    AppData: { profession }
} = require('../imports');

const profilePicPayload = joi.object({
    images: joi.required(),
    // type: joi.string().required().valid(1, 2),
});

const signupPayload = joi.object({
    emailAddress: joi.string()
        .email({
            minDomainSegments: 2, tlds: {
                allow: [
                    'com',
                    'net',
                ]
            }
        })
        .required(),
    password: joi.string().required(),
    name: joi.string().required(),
    phoneNumber: joi.string()
        .required()
        .regex(/^(1[ \-\+]{0,3}|\+1[ -\+]{0,3}|\+1|\+)?((\(\+?1-[2-9][0-9]{1,2}\))|(\(\+?[2-8][0-9][0-9]\))|(\(\+?[1-9][0-9]\))|(\(\+?[17]\))|(\([2-9][2-9]\))|([ \-\.]{0,3}[0-9]{2,4}))?([ \-\.][0-9])?([ \-\.]{0,3}[0-9]{2,4}){2,3}$/),
});
const completeProfile = joi.object({
    name: joi.string().required(),
    phoneNumber: joi.string()
        .required()
        .regex(/^(1[ \-\+]{0,3}|\+1[ -\+]{0,3}|\+1|\+)?((\(\+?1-[2-9][0-9]{1,2}\))|(\(\+?[2-8][0-9][0-9]\))|(\(\+?[1-9][0-9]\))|(\(\+?[17]\))|(\([2-9][2-9]\))|([ \-\.]{0,3}[0-9]{2,4}))?([ \-\.][0-9])?([ \-\.]{0,3}[0-9]{2,4}){2,3}$/),
})

const loginPayload = joi.object({
    emailAddress: joi.string()
        .email({
            minDomainSegments: 2, tlds: {

                allow: [
                    'com',
                    'net',
                ]
            }
        })
        .required(),
    password: joi.string()
        .required(),
});

const createTrip = joi.object({
    name: joi
        .string()
        .required(),
    description: joi
        .string()
        .required(),
})

// get date and time after 24h --- new Date() + 24 * 60 * 60 * 1000
// set the date and time after 24h to 0h 0m 0s --- (new Date(new Date() + 24 * 60 * 60 * 1000).setUTCHours(24,0,0,0)
// set a it into new date --- new Date(new Date(new Date() + 24 * 60 * 60 * 1000).setUTCHours(24,0,0,0))

const tripKeys = joi.object({
    startDate: joi
        .date().min(new Date(new Date(new Date() + 24 * 60 * 60 * 1000).setUTCHours(24, 0, 0, 0))),
    endDate: joi
        .date(),
    locations: joi
        .array()
        .items(joi.object(
            {
                id: joi
                    .number()
                    .integer(),
                country: joi
                    .string(),
                lat: joi
                    .string(),
                long: joi
                    .string(),
                locationTitle: joi
                    .string(),
                adrAddress: joi
                    .string(),
                url: joi
                    .string(),
                placeId: joi
                    .string()
            }
        )),
    tripType: joi
        .string()
        .valid('Private', 'Public'),
    tripCost: joi
        .number()
        .precision(3),
    numTravellers: joi
        .number()
        .integer()
        .strict()
        .message("No. of Travelers cannot be a decimal value."),
    note: joi
        .string(),
    imageURLs: joi
        .array()
        .items(joi.string()),
    tripName: joi
        .string(),
    description: joi
        .string()
})
    .min(1)
    .with('startDate', 'endDate')

const dayDetails = joi.object({
    description: joi
        .string()
        .required(),
    imageURLs: joi
        .array()
        .items(joi.string())
        .required(),
})
    .min(1)


const createBlog = joi.object({
    name: joi
        .string()
        .required(),
    imageURLs: joi
        .array()
        .items(joi.string())
        .required(),
    description: joi
        .string()
        .required()
})

const updateBlog = joi.object({
    name: joi
        .string(),
    imageURLs: joi
        .array()
        .items(joi.string()),
    pdfURLs: joi
        .array()
        .items(joi.string().required()),
    description: joi
        .string(),
})
    .min(1)
    .message("Can not have empty payload!")

const updatePlan = joi.object({
    name: joi
        .string(),
    price: joi
        .number()
        .precision(2),
    services: joi
        .array(),
    currency: joi
        .string(),
    interval: joi
        .string()
        .valid('month', 'year')
})
    .min(1)
    .message("Can not have empty payload!")

const createPlan = joi.object({
    name: joi
        .string()
        .required(),
    price: joi
        .number()
        .integer()
        .required(),
    currency: joi
        .string()
        .required(),
    interval: joi
        .string()
        .valid('daily','month', 'year')
        .required(),
})
    .strict()


const subscribeWithNewCard = joi.object({
    cardNumber: joi
        .number()
        .integer()
        .strict(),
    expMonth: joi
        .number()
        .integer()
        .strict(),
    expYear: joi
        .number()
        .integer()
        .strict(),
    cvc: joi
        .number()
        .integer()
        .strict(),
    cardHolder: joi
        .string(),
    cardType: joi
        .string()
        .valid('Visa', 'MasterCard'),
    planName: joi
        .string()
        .required(),
})

const addCard = joi.object({
    cardNumber: joi
        .number()
        .integer()
        .required()
        .strict(),
    expMonth: joi
        .number()
        .integer()
        .required()
        .strict(),
    expYear: joi
        .number()
        .integer()
        .required()
        .strict(),
    cvc: joi
        .number()
        .integer()
        .required()
        .strict(),
    cardHolder: joi
        .string()
        .required(),
    cardType: joi
        .string()
        .required(),
})

const postReviews = joi.object({
    revieweeId: joi
        .number()
        .integer()
        .required()
        .strict(),
    rating: joi
        .number()
        .integer()
        .required()
        .min(1)
        .max(5)
        .strict(),
    reviewText: joi
        .string()
        .required(),
    tripId: joi
        .number()
        .integer()
        .required()
})

const updateReviews = joi.object({
    rating: joi
        .number()
        .integer()
        .min(1)
        .max(5)
        .strict(),
    reviewText: joi
        .string()
})

const postBookTrips = joi.object({
    tripId: joi
        .number()
        .integer()
        .required(),
    slots: joi
        .array()
        .items(joi.number().integer())
})

const cancelBooking = joi.object({
    tripId: joi
        .number()
        .integer()
        .required(),
})


const postWishList = joi.object({
    tripId: joi
        .number()
        .integer()
        .required()
})
    .strict()


const followUser = joi.object({
    followeeId: joi
        .number()
        .integer()
        .required()
})
    .strict()

const postComment = joi.object({
    commentText: joi
        .string()
        .required(),
})

const forgotPassword = joi.object({
    emailAddress: joi
        .string()
        .required(),
})

const OTP = joi.object({
    OTP: joi
        // .number()
        // .integer()
        .string()
        .min(6)
        .max(6)
        .required(),
})

const reportUser = joi.object({
    reason: joi
        .string()
        .required()
        .strict(),
})

const resetPassword = joi.object({
    password: joi.string().required(),
    confirmPassword: joi.string().required(),
})

const changePassword = joi.object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
    confirmNewPassword: joi.string().required(),
})

const filterUser = joi.object({
    plan: joi.number(),
    category: joi.string(),
    search: joi.string()
})

const filterTrip = joi.object({
    status: joi
        .number()
        .integer()
        .valid(1, 2),
    category: joi
        .number()
        .valid('Public', 'Private'),
    search: joi
        .string()
})

const filterAccommodation = joi.object({
    category: joi.number(),
    search: joi.string(),
})

const createAccommodationCategory = joi.object({
    name: joi.string().required(),
})

const createAccommodation = joi.object({
    name: joi.string().required(),
    link: joi.string().required(),
    picURL: joi.string().required(),
    categoryId: joi.number().required()
})

const updateAccommodation = joi.object({
    name: joi.string(),
    link: joi.string(),
    picURL: joi.string(),
    categoryId: joi.number()
})
    .min(1)
    .message("Can not have empty payload!")

const updateProfile = joi.object({
    bio: joi
        .string()
        .allow(null, ''),
    name: joi
        .string(),
    locationTitle: joi
        .string()
        .allow(null, ''),
    lat: joi
        .string()
        .allow(null, ''),
    long: joi
        .string()
        .allow(null, ''),
    profilePicURL: joi
        .string()
        .allow(null, ''),
})
    .min(1)
    .strict()

const createDoc = joi.object({
    text: joi
        .string()
        .required(),
    type: joi
        .number()
        .integer()
        .valid(1, 2)
        .required(),
})

const updateDoc = joi.object({
    text: joi
        .string(),
    type: joi
        .number()
        .integer()
        .valid(1, 2)

})

const deleteCard = joi.object({
    cardId: joi
        .string()
        .required(),
})
const updateCard = joi.object({
    cardId: joi
        .string()
        .required(),
    exp_month: joi
        .number()
        .integer(),
    exp_year: joi
        .number()
        .integer(),
    name: joi
        .string(),
})
    .min(2)

const subscribeWithExistingCard = joi.object({
    planName: joi
        .string()
        .required(),
})

const reason = joi.object({
    reason: joi
        .string(),
    type: joi
        .number()
        .integer()
        .required(),
})

const warnUser = joi.object({
    reason: joi
        .string()
        .required()
})

module.exports = {
    signupPayload,
    loginPayload,
    profilePicPayload,
    createTrip,
    tripKeys,
    dayDetails,
    createBlog,
    updateBlog,
    createPlan,
    updatePlan,
    subscribeWithNewCard,
    addCard,
    postReviews,
    updateReviews,
    postBookTrips,
    postWishList,
    followUser,
    postComment,
    forgotPassword,
    OTP,
    resetPassword,
    updateProfile,
    cancelBooking,
    reportUser,
    filterUser,
    filterTrip,
    filterAccommodation,
    createAccommodationCategory,
    createAccommodation,
    updateAccommodation,
    createDoc,
    updateDoc,
    updateCard,
    deleteCard,
    subscribeWithExistingCard,
    completeProfile,
    reason,
    changePassword,
    warnUser
};