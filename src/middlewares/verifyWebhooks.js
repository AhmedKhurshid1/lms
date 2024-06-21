const { STRIPE_ACCESS_KEY, STRIPE_WEBHOOK_SECRET } = require('../config');
const stripe = require('stripe')(STRIPE_ACCESS_KEY);

const verifyWebHook = async (req, res, next) => {

    try {
        const sig = req.headers['stripe-signature'];
        let event = await stripe.webhooks.constructEvent(req.rawBody, sig, STRIPE_WEBHOOK_SECRET);
        req.headers.event = event
        next()
    }
    catch (exc) {
        let { message } = exc;
        console.log({ message, exc })
        throw new Error(exc)
    }

}
module.exports = verifyWebHook