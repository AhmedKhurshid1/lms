const { Errors } = require("../imports");
const { getThirdParty } = require("../imports/error.handlers");
const response = require("../libraries/response");
const { createLogs } = require("./logs.middleware");

const errorMiddleware = async (err, req, res, next) => {
    let { message, missingField = null, cause = null } = err;
    console.log("Error Middleware: ", { message, cause, err })
    let error = Errors.objects[message] || getThirdParty(err) || Errors.objects['Error']
    // if (message === 'NotFound')
    //     error.message = cause.errorMessage || `${cause.model} data not found!`
    if (missingField) error.missingField = missingField
    await createLogs('Error', req, error.message);

    // Rolling back the transaction
    let transaction = req.headers?.transaction;
    if (transaction) {
        await transaction.rollback();
        console.log("Transaction Rolled Back!")
    }
    response(res, error, error.status)
}


module.exports = {
    errorMiddleware,
}