const { Op } = require('sequelize')
const { MSSQL_DB_HOST } = require('../config');
const sequelize = require('../models/index');

const dbSetup = async () => {

    let dbInstance = null
    if (MSSQL_DB_HOST)
        dbInstance = await sequelize()
    return dbInstance

}


const createNotification = async (models, params) => {

    let { text, type, senderId, adminId, receiverId, senderName, receiverName, tripId, blogId, transaction = null } = params;
    let notification = { text, type, senderId, adminId, senderName, receiverName }
    delete params.transaction;
    let doc;
    let { id: notificationId } = await models['Notifications'].create(notification, { transaction })
    if (Array.isArray(receiverId)) {
        let tokens = [];
        let arr = receiverId?.map(({ name, id, userId }) => {
            tokens.push(id)
            return {
                text,
                type,
                receiverId: id || userId,
                senderName,
                receiverName: name,
                notificationId,
                tripId,
                blogId
            }
        })
        doc = await models['NotificationHistory'].bulkCreate(arr, { transaction })
        await firebaseNotifications.bulk(models, tokens, { type, text, senderName, senderId: senderId || adminId, notificationId, tripId, blogId })
    }
    if (!Array.isArray(receiverId)) {
        doc = await models['NotificationHistory'].create({ blogId, text, type, receiverId, senderName, receiverName, notificationId, tripId }, { transaction })
        await firebaseNotifications.single(models, { tripId, text, type, senderId: senderId || adminId, receiverId, senderName, receiverName, notificationId, blogId })
    }
    if (!notificationId || !doc)
        throw new Error('ErrorCreating')
    return doc
}

const createDocument = async (models, modelName, payload = {}) => {
    let { transaction = null } = payload;
    delete payload.transaction;
    let doc = await models[modelName].create(payload, { transaction })
    if (!doc)
        throw new Error('ErrorCreating')
    return doc
}

const updateDocument = async (models, modelName, payload, query = {}) => {
    let { transaction = null } = payload;
    delete payload.transaction;
    let doc = await models[modelName].update(
        payload,
        { where: query }, { transaction })
    if (!doc)
        throw new Error('ErrorUpdating')
    return doc
}

const firebaseNotifications = {
    bulk: async (models, receivers = [], payload) => {
        let { type, text, senderName, senderId, notificationId, tripId = null, blogId = null } = payload;
        let foundSessions = await models.UserSessions.findAll({
            where: { userId: { [Op.in]: receivers } },
            attributes: ['firebaseToken']
        })
        let tokens = []
        foundSessions?.forEach(({ dataValues }) => {
            if (checkFirebaseToken(dataValues?.firebaseToken))
                tokens.push(dataValues?.firebaseToken)
        })
        let data = {
            type: (type)?.toString(),
            senderName: senderName || "",
            notificationId: (notificationId)?.toString(),
            senderId: (senderId)?.toString(),
            tripId: (tripId)?.toString() || "",
            blogId: (blogId)?.toString() || "",
        }
        console.log("Bulk: ", data)
        if (tokens?.length)
            await messaging().sendMulticast({
                notification: { title: appData.Notifications.headings[type] || 'Notification', body: text },
                data,
                tokens: tokens,
                mutableContent: true
            })
    },
    single: async (models, payload) => {
        let { text, type, receiverId, senderName, receiverName, notificationId, senderId, tripId = null, blogId = null } = payload;
        let session = await models.UserSessions.findOne({ where: { userId: receiverId }, raw: true })
        let data = {
            type: (type)?.toString(),
            senderName: senderName,
            receiverName: receiverName || "",
            notificationId: (notificationId)?.toString(),
            senderId: (senderId)?.toString(),
            tripId: (tripId)?.toString() || "",
            blogId: (blogId)?.toString() || ""
        }
        console.log("Single: ", data)
        if (session?.firebaseToken)
            await messaging().sendMulticast({
                notification: { title: appData.Notifications.headings[type] || 'Notification', body: text },
                data,
                tokens: [session?.dataValues?.firebaseToken],
                mutableContent: true
            })
    },
    admins: async (payload) => {
        let { type, text, senderName, senderId, notificationId } = payload;
        let foundSessions = await models.AdminSessions.findAll({
            attributes: ['firebaseToken'],
            where: {
                firebaseToken: { [Op.ne]: null }
            }
        })
        let tokens = []

        // check if firebase token not null
        if (foundSessions?.length)
            foundSessions?.forEach(({ dataValues }) => {
                if (checkFirebaseToken(dataValues?.firebaseToken))
                    tokens.push(dataValues?.firebaseToken)
            })

        if (tokens?.length)
            await messaging().sendMulticast({
                notification: { title: appData.Notifications.headings[type] || 'Notification', body: text },
                data: {
                    type: (type)?.toString(),
                    senderName: senderName || "",
                    notificationId: (notificationId)?.toString(),
                    senderId: (senderId)?.toString(),
                },
                tokens: tokens,
                mutableContent: true
            })

    },
}

module.exports = {
    dbSetup,
    createNotification,
    createDocument,
    updateDocument
}