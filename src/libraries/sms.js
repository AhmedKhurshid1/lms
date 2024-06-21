const { MESSAGEBIRD_APIKEY } = require('../config');



const sendSMS = (data) => {

    const messagebird = require('messagebird')(MESSAGEBIRD_APIKEY);

    const {
        otp,
        phoneNumber
    } = data;

    var params = {
        'originator': "Who's On",
        'recipients': [
            phoneNumber
        ],
        'body': "Your Roam Trips verification code is: " + otp
    };

    return new Promise((resolve, reject) => {
        messagebird.messages.create(params, function (err, response) {
            if (err) {
              reject(err);
            }
            resolve(response);
          });
      });

}

module.exports = { sendSMS };
