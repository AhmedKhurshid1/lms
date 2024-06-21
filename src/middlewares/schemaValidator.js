const { ErrorsFactory } = require('../factories');

const response = require('../libraries/response');

const validators = require('../validators');

const joi = require('joi');

const schemaValidatorPicker = async (validatorName, req, res, next) => {
    try {
        const validatorToUse = validators[validatorName];

        const isValid = await validatorToUse.validate(req.body);

        if (isValid.error)
            throw isValid.error


        Object.assign(
            req.headers,
            { isValidRequestFor: validatorName }
        )

        next();
    } catch (err) {

        const useError = err.name || 'error-occured';
        const { Error: { error, status } } = new ErrorsFactory({ message: useError });
        let errorDetails = err?.details?.map((err) => err.message)
        errorDetails = errorDetails?.length ? errorDetails[0] : error.message
        response(res, { message: errorDetails, type: error.message }, status);
        
    }

}

const schemaValidator = (validatorName) => schemaValidatorPicker.bind(null, validatorName);

module.exports = {
    schemaValidator
}