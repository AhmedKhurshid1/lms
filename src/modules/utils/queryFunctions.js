/** Third party dependencies*/
const _ = require('lodash');
const moment = require('moment')
const bcrypt = require('bcrypt');
const { model } = require('mongoose');
const Sequelize = require('sequelize');
const { searchCols } = require('../../tests/helpers');
var admin = require("./../../libraries/firebase");
const { messaging } = require('firebase-admin');
const { twillioClient, twillioSid } = require('../../libraries/twilio');
const { Op } = require("sequelize");
const appData = require('../../imports/appData');
const nodemailer = require("nodemailer")
const {
    EMAIL,
    PASSWORD
} = require('../../config');

//const User=require('../../models/imports/users.model')
let models = global.db?.models;
let sequelize = global.db;

const findDocument = async (modelName, query = {}, type = 'get', metaData = {}) => {
    let { limit = 5, offset = 0 } = metaData;
    let { attributes, raw = false, errorMessage = null } = query;
    if (attributes)
        delete query.attributes
    if (errorMessage)
        delete query.errorMessage
    delete query.raw
    let doc = await models[modelName].findAll({
        where: query,
        attributes,
        limit, offset, raw
    });
    if (!doc && type == 'check' || !doc.length && type == 'check')
        throw new Error('NotFound', { cause: { model: modelName, errorMessage } })
    if (!doc.length && type == 'get' && typeof doc == 'array')
        return []
    if (doc.length > 1)
        return doc
    return doc[0]
}

const findDocumentWithAttributes = async (modelName, query = {}, type = 'get', attributesArray = []) => {
    let doc = await models[modelName].findAll({
        attributes: attributesArray,
        where: query
    });
    if (!doc && type == 'check' || !doc.length && type == 'check')
        throw new Error('NotFound')
    if (doc.length > 1)
        return doc
    return doc[0]
}

const findDocumentWithPagination = async (modelName, query = {}, type = 'get', pageN, pageS) => {
    let pageSize = pageS;
    let pageNumber = pageN;

    if (pageSize == null || pageNumber == null) {
        pageSize = null;
        pageNumber = null;
    }
    else {
        pageNumber = pageNumber - 1;
    }

    let doc = await models[modelName].findAll({
        where: query,
        limit: pageSize,
        offset: pageNumber * pageSize
    });
    if (!doc && type == 'check' || !doc.length && type == 'check')
        throw new Error('NotFound')
    if (doc.length > 1)
        return doc
    return doc[0]
}

const findByJoin = async (payload, type = 'get') => {
    let {
        innerModel,
        outerModel,
        innerQuery = {},
        outerQuery = {},
        innerAs = null,
        metaData = {},
        outerAttributes = null,
        innerAttributes = null
    } = payload;
    let { limit = 5, offset = 0 } = metaData;
    let doc = await models[outerModel].findAll(
        {
            include: [{
                model: models[innerModel],
                as: innerAs,
                where: innerQuery,
                attributes: innerAttributes
            }],
            where: outerQuery,
            attributes: outerAttributes,
            limit, offset
        })

    if (!doc && type == 'check' || !doc.length && type == 'check')
        throw new Error('NotFound')
    return doc
}

const findByJoins = async (payload, type = 'get') => {
    let {
        innerModels = [],
        outerModel,
        outerQuery = {},
        metaData = {},
        outerAttributes = null,
        group = null, order = null, raw = false
    } = payload;
    let { limit = 5, offset = 0 } = metaData;
    let doc = await models[outerModel].findAll(
        {
            include: innerModels,
            where: outerQuery,
            attributes: outerAttributes,
            limit, offset, raw, order
        })

    if (!doc && type == 'check' || !doc.length && type == 'check')
        throw new Error('NotFound')
    return doc
}

const searchByQuery = async (payload, type = 'get') => {

    let {
        query,
        metaData,
        modelName,
        innerModels,
        outerQuery = {},
    } = payload;
    let { limit = 5, offset = 0 } = metaData;
    let Op = Sequelize.Op;
    let cols = searchCols[modelName]?.map((col) => ({ [col]: sequelize.where(sequelize.fn('LOWER', sequelize.col(col)), 'LIKE', '%' + (query).toLowerCase() + '%') }))
    let doc = await models[modelName].findAll({
        where: {
            [Op.or]: cols,
            ...outerQuery
        },
        include: innerModels,
        limit, offset
    })
    if (!doc && type == 'check' || !doc.length && type == 'check')
        throw new Error('NotFound')
    return doc
}


const findByJoinManyToMany = async (payload, type = 'get') => {
    let { innerModel,
        outerModel,
        innerQuery = {},
        outerQuery = {},
        //these have been set to null as providing an empty array would actually affect the output
        outerAttributes = null,
        innerAttributes = null,
        junctionAttributes = null
    } = payload;
    let doc = await models[outerModel].findAll({
        attributes: outerAttributes,
        include: [{
            model: models[innerModel],
            innerQuery,
            attributes: innerAttributes,
            through: {
                attributes: junctionAttributes,
            }
        }],
        where: outerQuery
    });
    if (!doc && type == 'check' || !doc.length && type == 'check')
        throw new Error('NotFound')
    return doc;
}

const updateDocument = async (modelName, payload, query = {}) => {
    let { transaction = null } = payload;
    delete payload.transaction;
    let doc = await models[modelName].update(
        payload,
        { where: query }, { transaction })
    if (!doc)
        throw new Error('ErrorUpdating')
    return doc
}

const createDocument = async (modelName, payload = {}) => {
    let { transaction = null } = payload;
    delete payload.transaction;
    let doc = await models[modelName].create(payload, { transaction })
    if (!doc)
        throw new Error('ErrorCreating')
    return doc
}

const softDelete = async (modelName, query = {}) => {
    let { transaction = null } = query;
    delete query.transaction;
    let doc = await models[modelName].update(
        { isDeleted: true },
        {
            where: query
        }, { transaction })
    return doc
}

const stringToArray = (stringToConvert) => {
    let data = stringToConvert.substr(1, stringToConvert.length - 2)
    data = data.split(',')
    let images = data.map(item => (
        item.substr(1, item.length - 2)
    ));
    // if (!images.length > 1)
    //     return []
    return images
}

const hardDelete = async (modelName, query = {}) => {
    let { transaction = null } = query;
    delete query?.transaction;
    let doc = await models[modelName].destroy({
        where: query
    }, { transaction });
    return doc;
}

const emailOTP = async ({ emailAddress, otp, name = "User" }) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL,
            pass: PASSWORD
        },
    });
    const mailOptions = {
        from: { address: EMAIL, name: 'Roam-Trips' },
        to: emailAddress,
        subject: "Roam-Trips One Time Password",
        text: `Hi ${name},\n\nWelcome to Roam Trips! To complete your signup process, please verify your phone number by entering the following verification code in the app: ${otp}.\nIf you did not initiate this signup process, please ignore this message.\n\nThank you,\n\nTeam Roam Trips.`
    };
    await transporter.sendMail(mailOptions)

}



module.exports = {
    findDocument,
    softDelete,
    updateDocument,
    createDocument,
    findByJoin,
    stringToArray,
    findDocumentWithPagination,
    hardDelete,
    findByJoinManyToMany,
    findDocumentWithAttributes,
    findByJoins,
    searchByQuery,
    emailOTP
}