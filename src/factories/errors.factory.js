const { Errors } = require('../imports');

class ErrorsFactory {

    message = '';
    status = 500;

    /**
     * Returns a factory to generate a custom API Error
     * average time per element for all answerscripts in an exam.
     * @param {string} dataObject.message - Message Data object with error config
     * @param {string|number} dataObject.status - Status to set in Data object with error config
     * @returns {ErrorsFactory} ErrorsFactory Object - An error factory object
     */
    constructor(dataObject) {
        let { message, status } = dataObject;

        try {
            const error = Errors.objects[message] || (message ? { message, status: 500 } : undefined) || Errors.objects['Error'];
            const { message: messageToUse, status: errorStatus } = error;

            Object.assign(
                this,
                {
                    message: messageToUse || message,
                    status: errorStatus || status,
                }
            )

        } catch (exc) {
            throw exc;
        }
    };

    get Error() {
        const { status, message } = this;

        return {
            error: new Error(
                message,
                status
            ),
            status,
        }
    }
}


module.exports = ErrorsFactory;