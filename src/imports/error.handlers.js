/** Third party dependencies **/
const httpStatus = require("http-status");
const { Errors } = require(".");
const { ErrorsFactory } = require("../factories");
const { createLogs } = require("../middlewares/logs.middleware");

const {
  createDocument,
  findDocument,
} = require("../modules/utils/queryFunctions");
const { Transaction } = require("sequelize");

const getError = ({ message, instance }) => {
  let errorsFactory = {
    errors: {
      NotFound: {
        message: `${instance} instance does not exist!`,
        status: httpStatus.BAD_REQUEST,
      },
      AlreadyExists: {
        message: `${instance} instance already exists!`,
        status: httpStatus.BAD_REQUEST,
      },
      AlreadyPublished: {
        message: `${instance} instance already published!`,
        status: httpStatus.BAD_REQUEST,
      },
    },
    types: [
      "ValidationError",
      "Error",
      "TypeError",
      "ReferenceError",
      "MongoError",
    ],
  };
  return errorsFactory.errors[message];
};

const getThirdParty = (err) => {
  console.log("Third Party Error Function", err.parent)
  if (!err.message) return undefined;
  let errorPayload = {
    message: err.message,
    type: err.type || err.name,
    status: 500,
  }
  // if (err?.parent?.detail)
  //   errorPayload = { ...errorPayload, message: err?.parent?.detail }
  return errorPayload;
};

const getThirdPartyMessage = (message) => {
  if (!message) return undefined;
  return { message, status: 500 };
};

const catchAsyncErrors = (theFunc) => async (req, res, next) => {
  Promise.resolve(theFunc(req, res, next))
    .then(() => {
      res.on("finish", async () => {
        let transaction = req.headers?.transaction;
        await createLogs("Success", req);
        if (transaction) {
          await transaction.commit();
          console.log("Transaction Successfull!")
        }
      });
    })
    .catch(next);
};

const throwError = (message, model = null) => {
  let error = new Error(message);
  if (model) error.model = model;
  throw error;
};


module.exports = {
  getError,
  catchAsyncErrors,
  getThirdParty,
  getThirdPartyMessage,
  throwError,
};
