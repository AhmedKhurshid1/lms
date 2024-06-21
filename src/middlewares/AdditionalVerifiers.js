const moment = require("moment");
const { AppData } = require("../imports");
const { getSubscriptionById } = require("../libraries/stripe");
const { findDocument } = require("../modules/utils/queryFunctions");
let { Op } = require('sequelize');
// const Subscriptions = require("../modules/plans/plans.service");
const appData = require("../imports/appData");
let { AccessControl: { subscription: { approvedRoutes } } } = AppData

class AccessControl {

    constructor(metaData = {}) { Object.assign(this, metaData) }

    subscription = async () => {

        console.log(this.req.route.path)

        /* Approved Routes For Verifier */
        if (approvedRoutes.includes(this.req.route.path)) return

        let { subscribedPlan, planSubscribed, usedFreeTrial } = this.User;
        let Subscription = await findDocument('Subscriptions', { id: subscribedPlan, raw: true })

        if (!Subscription)
            throw new Error('AccessDenied')

        const plan = new Subscriptions({ User: this.User, Subscription })

        /* If Subscription is expired */
        if (Subscription.planId === appData.Plans.Free && (new Date(moment(Subscription.expiry).format('YYYY-MM-DD')) < new Date(moment(new Date()).format('YYYY-MM-DD')))) {
            await plan.delete()
            throw new Error('SubscriptionExpired')
        }

        /* If Subscribed to Free Plan */
        if (planSubscribed === appData.Plans.Free) return

        /* If Subscribed to a Paid Plan */
        if (Subscription && planSubscribed !== appData.Plans.Free) {
            let { status } = await getSubscriptionById(Subscription?.subscriptionId)
            console.log({ status })
            if (status === 'active') return
        }

        throw new Error('AccessDenied')

    }

    blocked = () => {
        let { status } = this.User
        if (status !== appData.Users.status.BLOCKED) return
        throw new Error('UserBlocked')
    }

}

module.exports = AccessControl