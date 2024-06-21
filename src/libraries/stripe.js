
const moment = require('moment');
const {
  STRIPE_ACCESS_KEY,
  STRIPE_WEBHOOK_SECRET
} = require('../config');
const { updateDocument, createDocument, findDocument, hardDelete } = require('../modules/utils/queryFunctions');
const { _test } = require('@hapi/joi/lib/types/date');

const stripe = require('stripe')(STRIPE_ACCESS_KEY);
let models = global?.db.models

const createUser = async (name, emailAddress) => {

  try {
    const { id: userStripeId } = await stripe.customers.create({
      description: 'new customer',
      email: emailAddress,
      name: name
    });
    return userStripeId;
  }
  catch (err) {
    console.error(err);
    throw new Error(err);
  }
}


const createCard = async (...params) => {
  let [cardNo, expMonth, expYear, cvc, userStripeId, cardHolder] = params;
  try {

    const { id: tokenId } = await stripe.tokens.create({
      card: {
        number: cardNo,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvc,
        name: cardHolder
      }
    });

    const { id: stripeCardId } = await stripe.customers.createSource(
      userStripeId,
      {
        source: tokenId
      }
    );
    return { stripeCardId };
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}



const chargeAmount = async (amount, userStripeId, cardId, currency, desc) => {

  try {
    const charge = await stripe.charges.create(

      {
        amount: amount * 100,
        customer: userStripeId,
        currency: currency,
        source: cardId,
        description: desc
      });

    return { charge }
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }

}



const getAllCards = async (userStripeId) => {

  try {
    const cards = await stripe.customers.listSources(
      userStripeId,
      { object: 'card' }
    );
    return { cards }
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }

}




const createProduct = async (productName) => {
  try {
    const { id: productId } = await stripe.products.create({
      name: productName,
    });
    return { productId }
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }

}



const createProductPrice = async (productId, price, currency, interVal) => {

  const { id: priceId } = await stripe.prices.create({
    unit_amount: price * 100,
    currency: currency,
    recurring: { interval: interVal },
    product: productId,
  });
  return { priceId }

}


const subscribeProduct = async (customerId, priceId, cardId) => {
  let updatedCustomer = await stripe.customers.update(
    customerId,
    { default_source: cardId }
  );

  const { id: subId, current_period_end, ...rest } = await stripe.subscriptions.create({
    customer: customerId,
    cancel_at_period_end: true,
    items: [
      { price: priceId },
    ],
    cancel_at_period_end: true,
    expand: ["latest_invoice.payment_intent"]
  });
  // console.log({ rest, invoiceDetails: rest.latest_invoice })
  let invoiceDetails = {
    clientSecret: rest?.latest_invoice?.payment_intent?.client_secret,
    invoiceId: rest?.latest_invoice?.id,
    invoiceURL: rest?.latest_invoice?.hosted_invoice_url,
    invoicePDF: rest?.latest_invoice?.invoice_pdf,
    expiry: moment.unix(current_period_end).format()
  }
  return { subId, invoiceDetails }
}



const unsubscribeProduct = async (subId) => {
  const { id: deleteSubId } = await stripe.subscriptions.del(
    subId
  );
  return { deleteSubId }
}


const getSubscriptionById = async (subId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(
      subId
    );
    return subscription
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }

}

const createNewStripeCard = async (params) => {
  let { cardNumber, expMonth, expYear, cvc, userStripeIdToUse, cardHolder, cardType, userId } = params;
  const { stripeCardId } = await createCard(cardNumber, expMonth, expYear, cvc, userStripeIdToUse, cardHolder)
  let cardPayload = {
    stripeCardId,
    cardHolderName: cardHolder,
    cardType, userId
  }
  let cardCreated = await createDocument('Cards', cardPayload);
  let User = await findDocument('Users', { userId }, 'check');

  // if (!User.dataValues.defaultCardId)
  await updateDocument('Users', { defaultCardId: stripeCardId }, { userId });

  return { stripeCardId, card: cardCreated }
}

const deleteStripeCard = async (userStripeId, stripeCardId) => {
  await stripe.customers.deleteSource(
    userStripeId,
    stripeCardId
  );
}


const createNewStripeUser = async (userId, name, email, transaction) => {
  const userStripeId = await createUser(name, email)
  await updateDocument('Users', { userStripeId, transaction }, { userId })
  return userStripeId
}

const createNewSubscription = async (...params) => {

  let stripeSubId = null
  let dbSubId = null
  try {
    let [userStripeId, stripePriceId, userId, planId, cardId, transaction] = params;
    let { subId: subscriptionId, invoiceDetails } = await subscribeProduct(userStripeId, stripePriceId, cardId)
    stripeSubId = subscriptionId;
    let { id } = await createDocument('Subscriptions', { subscriptionId, userId, planId, ...invoiceDetails })
    dbSubId = id;
    await updateDocument('Users', { planSubscribed: planId, subscribedPlan: id, transaction, usedFreeTrial: true }, { userId })
  }
  catch (exc) {
    console.log({ stripeSubId, dbSubId })
    if (dbSubId)
      hardDelete('Subscriptions', { id: dbSubId })
    if (stripeSubId)
      await unsubscribeProduct(stripeSubId)
    throw exc
  }
}

const retreiveACard = async (customerId, cardId) => {
  const card = await stripe.customers.retrieveSource(
    customerId,
    cardId
  );
  return card
}

const retreiveCards = async (customerId, metaData = {}) => {

  let { limit = 5, offset = 0 } = metaData;
  const cards = await stripe.customers.listSources(customerId,
    { object: 'card', limit, offset }
  );
  return cards;

}

const updateStripeCard = async (customerId, cardId, payload) => {
  delete payload.cardId
  const card = await stripe.customers.updateSource(
    customerId,
    cardId,
    payload
  );
  return card;
}

const listProducts = async (prodId = null) => {

  let data = null
  if (!prodId)
    data = await stripe.products.list({
      limit: 3,
    });
  if (prodId)
    data = await stripe.products.retrieve(
      prodId
    );
  return data;

}

const retrievePrice = async (priceId = null) => {

  console.log({ priceId })
  let price = await stripe.prices.retrieve(
    priceId
  );
  return price

}

const updateStripeProduct = async (productId, name) => {

  const product = await stripe.products.update(
    productId,
    { name }
  );
  return product

}

const verifyWebHook = async (req) => {

  const sig = req.headers['stripe-signature'];
  let event = await stripe.webhooks.constructEvent(req.rawBody, sig, STRIPE_WEBHOOK_SECRET);
  return event

}


module.exports = {
  createCard,
  createUser,
  chargeAmount,
  getAllCards,
  createProduct,
  createProductPrice,
  subscribeProduct,
  unsubscribeProduct,
  getSubscriptionById,
  createNewStripeUser,
  createNewStripeCard,
  createNewSubscription,
  deleteStripeCard,
  retreiveACard,
  retreiveCards,
  updateStripeCard,
  listProducts,
  retrievePrice,
  updateStripeProduct,
  verifyWebHook
}