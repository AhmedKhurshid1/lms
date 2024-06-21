const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const baseURL = 'localhost:4040/api/';
const moment = require('moment')

const users = {
    valid: {
        emailAddress: "cow@gmail.com",
        password: "Password__123"
    },
    inValid: {
        emailAddress: "invalid@gmail.com",
        password: "Password__123"
    },
    userObj: {
        "userId": 3,
        "name": "Furqan Hassan",
        "password": "Password__123",
        "emailAddress": "furqan@gmail.com",
        "phoneNumber": "+923321028991",
        "type": null,
        "planSubscribed": null,
        "profilePicURL": null,
        "provider": null,
        "idCardURL": null,
        "bio": null,
        "firebaseToken": null,
        "isVerified": null,
        "jwtToken": null,
        "status": 1,
        "OTP": 645471,
        "OTPused": true,
        "OTPExpiration": "2022-12-14T13:04:42.037Z",
        "userStripeId": null,
        "subscriptionId": null,
        "defaultCardId": null,
        "location": null,
        "createdAt": "2022-12-14T12:59:42.793Z",
        "updatedAt": "2022-12-14T13:00:00.326Z",
    }
}

const extractToken = async (route) => {
    let token = null;
    chai.request(baseURL)
        .post(route)
        .send(users.valid)
        .end((err, res) => {
            if (err || !res.body.accessToken)
                throw new Error(err.message)
            token = res.body.accessToken;
        });
    return token;
}

const addParams = (should, method, tripId) => {
    if (should == 'notFound')
        return "/99999"
    if (method == 'put')
        return "/" + tripId
    return ''
}

const planQuery = (should, planName) => {
    if (should == 'getPlan')
        return planName
    if (should == 'notFound')
        return 'InvalidName'
    return null
}


const getParams = (should, against, idOne, idTwo = 'none') => {
    if (should == against)
        return idOne
    if (idTwo == 'none')
        return ''
    return idTwo
}

const getDateAhead = (days = 30) => moment(new Date()).add(days, "day").format();


const safeAttributes = {
    user: ['userId', 'name', 'emailAddress', 'phoneNumber', 'bio', 'profilePicURL', 'isVerified', 'rating', 'planSubscribed', 'defaultCardId', 'subscribedPlan', 'usedFreeTrial', 'OTP','status'],
    notifications: ['id', 'isRead', 'text', 'senderName', 'receiverName', 'type', 'createdAt', 'updatedAt', 'tripId', 'blogId'],
    location: ['id', 'lat', 'long', 'locationTitle'],
    tripLocation: ['id', 'lat', 'long', 'locationTitle', 'placeId', 'url', 'country'],
    plan: ['planId', 'name', 'price', 'description', 'stripeProductId', 'stripePriceId', 'currency', 'interval'],
    trip: ['tripId',
        'tripName',
        'startDate',
        'endDate',
        'tripCost',
        'imageURLs',
        'description',
        'tripType',
        'numTravellers',
        'slotsRemaining',
        'note',
        'isPublished',
        'hostId',
        'createdAt',
        'updatedAt',
        'isDeleted'
    ]
}


const searchCols = {
    Trips: ['tripName', 'description', 'tripType', 'note'],
    Communities: ['name', 'description'],
    Users: ['bio', 'emailAddress', 'Users.name'],
    Friends: ['name'],
}

const checkForEmptyStrings = (text, existing) => {
    if (text === '') return ''
    if (!text) return existing
    if (text) return text
}


const validationChecks = {
    subscription: (obj) => {
        let validKeys = {
            'cardNumber': true,
            'expMonth': true,
            'expYear': true,
            'cvc': true,
            'cardHolder': true,
            'cardType': true,
            'planName': true
        }
        //Key Checks
        Object.keys(obj)?.forEach((key, index) => {
            if (!validKeys[key]) {
                let error = new Error('ValidationError')
                error.missingField = key
                throw error
            }
        })
    },
    publishTrip: (obj) => {
        console.log({ obj })
        let validKeys = {
            'startDate': true,
            'endDate': true,
            'imageURLs': true,
            'tripName': true,
            'numTravellers': true,
            'tripType': true,
            'description': true,
            'tripDays': true,
            'tripCost': true,
        }
        Object.keys(obj)?.forEach((key) => {
            if (validKeys[key] && !obj[key]) {
                let error = new Error('InvalidPublishRequest')
                error.missingField = key
                throw error
            }
        })
    },
    tripDays: (arr) => {
        let validKeys = {
            'description': true,
            'imageURLs': true,
        }
        arr?.forEach(({ dataValues }) => {
            Object.keys(dataValues)?.forEach((key) => {
                if (validKeys[key] && !dataValues[key]) {
                    let error = new Error('InvalidPublishRequestDays')
                    error.missingField = { dayNumber: dataValues?.dayNumber }
                    throw error
                }
            })
        })
    }
}

const refinedDates = (start, end) => {
    let [startDate] = start.split('T')
    let [endDate] = end.split('T')
    return [startDate, endDate]
}

module.exports = {
    baseURL,
    users,
    extractToken,
    addParams,
    planQuery,
    getParams,
    safeAttributes,
    validationChecks,
    searchCols,
    checkForEmptyStrings,
    refinedDates,
    getDateAhead
}