const chai = require('chai');
const { users } = require('./helpers');
const expect = chai.expect;
const should = chai.should;

//All 'Shoulds' in a test case.
const testMap = {
    Login: "it should return an object containing an accessToken",
    TrialExpired: `it should return a failed 403 response if Authorization Token is not provided`,
    InvalidToken: `it should return a failed 403 response if an invalid Token is provided`,
    createTrip: 'Should return an object with an property message = Trip Created!',
    addSingleKeys: 'Should return an object with a property message = Trip Updated!',
    addDayDetails: 'Should return an object with a property message = Day Updated!',
    publishTrip: 'Should return an object with a property message = Trip Published!',
    alreadyPublished: 'Should return an object with a property message = already_published',
    emptyBody: 'Should return an object with a property message = Validation Error',
    notFound: 'it should return a failed 400 response if an invalid query/param is provided',
    getTripById: 'Should return an object with a host and trip object',
    getHostedTrips: 'Should return an array with all hosted trips by User',
    getAllTrips: 'Should return an array with all existing trips',
    createPlan: 'Should return an object with a property message = Plan Created!',
    getPlans: 'Should return an array with existing plans',
    getPlan: 'Should return an object with plan details',
    postReview: 'Should return an object with a property message = Review Posted',
    updateReview: 'Should return an object with a property message = Review Posted',
    getReviews: "Should return an object with User's details and an array of reviews",
    getReview: 'Should return an object with user details and reviewers data',
    getBlogsByUser: 'Should return an object containing user data with an array of blogs',
    getBlogByBlogId: 'Should return an object containing user data with an array of blogs',
    getBlogs: 'Should return an array of blogs containing blog details and user data',
    createBlog: 'Should return an object with a property message = Blog Created!',
    updateBlog: 'Should return an object with a property message = Blog Updated!',
    postComment: 'Should return an object with a property message = Comment Posted!',
    updateComment: 'Should return an object with a property message = Comment Updated!',
    getComments: 'Should return an array of comments containing comment details and user data',
    deleteComment: 'Should return an object with a property message = Comment Deleted!'
}

// Map For Validating Response Fields.
const validatorMap = {

    //Validates if the response contains all the expected keys/properties.
    valueValidator: (res, properties, body = { message: null }) => {
        let keys = Object.keys(body).map((key) => key)
        properties?.map((property, index) => {
            expect(res).to.have.property(keys[index], property);
        })
    },

    //Validates the status of the response.
    statusValidator: (res, status) => {
        res.should.have.status(status);
    },

    //Validates the type of the response.
    payloadTypeValidator: (res, type) => {
        if (type == 'object')
            res.body.should.be.a('object');
        if (type == 'array')
            res.body.should.be.a('array');
    },

    //Validates if the response contains all the expected keys/properties.
    payloadValidator: (obj, body = {}) => {
        let keys = Object.keys(body).map((key) => key)
        keys?.map((key) => {
            expect(obj).to.have.property(key);

        })
    },
}

// Sample for sending a body in a request.
const reqBodies = {
    signUp: {
        emailAddress: "ben10@gmail.com",
        password: "Password__123",
        name: "Iftikhar Chaudry",
        phoneNumber: "+923321020992"
    },
    createTrip: {
        "name": "My First Test Trip"
    },
    addSingleKeys: {
        "tripType": "Private",
        "note": "Keep your bags with you.",
        "startDate": "2023-03-02T22:02:09.648068+00:00",
        "endDate": "2023-03-07T22:02:09.648068+00:00",
        "tripCost": 768,
        "description": "Description about the trip",
        "numTravellers": 5,
        "location": "Texas, TX",
        "tripName": "Third Trip",
        "imageURLs": ["atif", "data:junaid", "data:akram"]
    },
    addDayDetails: {
        "description": "Maza karengay full",
        "imageURLs": ["data:url", "data:url"],
        "dayNumber": 1
    },
    createPlan: {
        "name": "Premium",
        "price": 500,
        "currency": "usd",
        "interval": "month"
    },
    postReview: {
        "reviewText": "Dont join this review. Its a scam.",
        "revieweeId": 3,
        "rating": 5
    },
    blogs: {
        "imageURLs": ["data:image"],
        "pdfURLs": ["urls"],
        "name": "Second Blog",
        "description": "A Great Blog"
    },
    comment: {
        "commentText": "What an amazing blog."
    }
}

// Sample responses for validating a body in a request response.
const resBodies = {
    metaData: {
        limit: null,
        offset: null
    },
    gerTripById: {
        "userId": 2,
        "name": "Asmar Hassan",
        "password": "Password__123",
        "emailAddress": "asmar@gmail.com",
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
        "OTP": 526196,
        "OTPused": true,
        "OTPExpiration": "2022-12-14T13:04:11.176Z",
        "userStripeId": "cus_MzFb87WhSNlN3h",
        "subscriptionId": "sub_1MGfsIJBKIAcBht2pMhiCtI0",
        "defaultCardId": "card_1MFH5uJBKIAcBht2ayVrNX4R",
        "location": null,
        "createdAt": "2022-12-14T12:59:11.894Z",
        "updatedAt": "2022-12-19T09:43:12.605Z",
        "trip": {}
    },
    trip: {
        "imageURLs": [
            "atif",
            "data:junaid",
            "data:akram"
        ],
        "tripId": 31,
        "tripName": "Third Trip",
        "startDate": "2023-03-02T22:02:09.648Z",
        "endDate": "2023-03-07T22:02:09.648Z",
        "tripCost": 768,
        "description": "Description about the trip",
        "tripType": "Private",
        "numTravellers": 5,
        "slotsRemaining": 5,
        "note": "Keep your bags with you.",
        "isPublished": true,
        "location": "Texas, TX",
        "createdAt": "2022-12-21T12:18:06.859Z",
        "updatedAt": "2022-12-21T12:18:12.814Z"
    },
    signUpParent: {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsQWRkcmVzcyI6ImJlbjEwMDAwMUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IlBhc3N3b3JkX18xMjMiLCJuYW1lIjoiQWxpIElmdGlraGFyIFNhaGFiIiwicGhvbmVOdW1iZXIiOiIrOTIzMzIxMDI4OTkxIiwic3RhdHVzIjowLCJPVFAiOjMyNTM5OSwiT1RQRXhwaXJhdGlvbiI6IjIwMjItMTItMjNUMDY6NDA6NTMuODU0WiIsIk9UUHVzZWQiOmZhbHNlLCJ1cGRhdGVkQXQiOiIyMDIyLTEyLTIzVDA2OjM1OjU0LjgzMVoiLCJjcmVhdGVkQXQiOiIyMDIyLTEyLTIzVDA2OjM1OjU0LjgzMVoiLCJ0eXBlIjpudWxsLCJwbGFuU3Vic2NyaWJlZCI6bnVsbCwicHJvZmlsZVBpY1VSTCI6bnVsbCwicHJvdmlkZXIiOm51bGwsImlkQ2FyZFVSTCI6bnVsbCwiYmlvIjpudWxsLCJmaXJlYmFzZVRva2VuIjpudWxsLCJpc1ZlcmlmaWVkIjpudWxsLCJqd3RUb2tlbiI6bnVsbCwidXNlclN0cmlwZUlkIjpudWxsLCJzdWJzY3JpcHRpb25JZCI6bnVsbCwiZGVmYXVsdENhcmRJZCI6bnVsbCwibG9jYXRpb24iOm51bGwsImlhdCI6MTY3MTc3NzM1NCwiZXhwIjoxNjcxODc3MzUzfQ.dDNyEkI1v5HRsAp76pu1Z5qWZrgyv60bs3yEWBfgVY4",
        "userDocument": {
            "userId": 4,
            "emailAddress": "ben100001@gmail.com",
            "password": "Password__123",
            "name": "Ali Iftikhar Sahab",
            "phoneNumber": "+923321028991",
            "status": 0,
            "OTP": 325399,
            "OTPExpiration": "2022-12-23T06:40:53.854Z",
            "OTPused": false,
            "updatedAt": "2022-12-23T06:35:54.831Z",
            "createdAt": "2022-12-23T06:35:54.831Z",
            "type": null,
            "planSubscribed": null,
            "profilePicURL": null,
            "provider": null,
            "idCardURL": null,
            "bio": null,
            "firebaseToken": null,
            "isVerified": null,
            "jwtToken": null,
            "userStripeId": null,
            "subscriptionId": null,
            "defaultCardId": null,
            "location": null
        }
    },
    plan: {
        "planId": 1,
        "name": "Standard",
        "price": 3499,
        "stripeProductId": null,
        "stripePriceId": null,
        "currency": "usd",
        "interval": "month",
        "createdAt": "2022-12-15T13:01:15.667Z",
        "updatedAt": "2022-12-15T13:01:15.667Z"
    },
    reviewParent: {
        ...users.userObj,
        "reviewData": {}
    },
    reviewsParent: {
        ...users.userObj,
        "reviews": []
    },
    review: {
        "reviewId": 3,
        "reviewText": "Dont join this review. Its a scam.",
        "rating": 5,
        "revieweeId": 2,
        "createdAt": "2022-12-14T13:02:28.395Z",
        "updatedAt": "2022-12-14T13:02:28.395Z",
        "reviewerId": 1,
        "User": {}
    },
    blogs: {
        "imageURLs": ["data:image"],
        "pdfURLs": ["urls"],
        "name": "Second Blog",
        "description": "A Great Blog"
    },
    getBlogById: {
        ...users.userObj,
        blogData: null
    },
    getBlog: {
        "imageURLs": ["data:image"],
        "pdfURLs": ["urls"],
        "blogId": 5,
        "name": "Second Blog",
        "description": "A Great Blog",
        "createdAt": "2022-12-23T12:27:21.750Z",
        "updatedAt": "2022-12-23T12:27:21.750Z",
        "userId": 2
    },
    allBlogs: {
        success: true,
        allBlogs: []
    },
    comment: {
        "id": 1,
        "commentText": "Changed the text",
        "isDeleted": false,
        "createdAt": "2023-01-03T09:55:40.190Z",
        "updatedAt": "2023-01-03T10:13:57.651Z",
        "userId": 1,
        "blogId": 1,
        "User": null
    }

}

//Routes for API endpoints
const apiRoutes = {
    trips: {
        createTrip: 'trips/create',
        addDayDetails: 'trips/create/day',
        publishTrip: 'trips/publish',
        getTripById: 'trips/getTrips/',
        getBookedTrips: 'trips/getTrips/bookings/',
        getHostedTrips: 'trips/getTrips/hostedTrips/',
        getAllTrips: 'trips/getTrips',
    },
    plans: {
        createPlan: 'plans/createPlan',
        getAllPlans: 'plans/allPlans'
    },
    reviews: {
        post: 'reviews/create',
        update: 'reviews/update/',
        getAll: 'reviews/getAll/',
        getOne: 'reviews/get/'
    },
    blogs: {
        create: 'blogs/create',
        update: 'blogs/update/',
        getAllByUser: 'blogs/get',
        getById: 'blogs/get/',
        getAll: 'blogs/getAll'
    },
    comments: {
        post: 'blogs/comment/create/1',
        update: 'blogs/comment/update/',
        delete: 'blogs/comment/delete/',
        getAll: 'blogs/comment/get/1'
    }
}

const pdfOptions = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    childProcessOptions: {
      env: {
        OPENSSL_CONF: "/dev/null"
      }
    },
  };

module.exports = {
    testMap,
    validatorMap,
    reqBodies,
    apiRoutes,
    resBodies,
    pdfOptions
}