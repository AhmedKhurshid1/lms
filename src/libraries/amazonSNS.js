var AWS = require('aws-sdk');
const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    REGION,
} = require('../config');
const { emailOTP } = require('../modules/utils/queryFunctions');
AWS.config.update({ region: REGION });

const amazonSNS = async (metaData = {}) => {

    let { otp, phoneNumber, name = "User", emailAddress } = metaData;
    var params = {
        Message: `Hi ${name},\n\nWelcome to Roam Trips! To complete your signup process, please verify your phone number by entering the following verification code in the app: ${otp}.\nIf you did not initiate this signup process, please ignore this message.\n\nThank you,\n\nTeam Roam Trips.`,
        PhoneNumber: phoneNumber,
    };
    let sns = new AWS.SNS({ apiVersion: "2010–03–31" })
    let result = await sns.publish(params).promise()
    if (emailAddress)
        await emailOTP({ name, emailAddress, otp })
    return result

}




module.exports = { amazonSNS }
