const { ErrorsFactory } = require('../factories');

const { Errors: { types: errorTypes } } = require('../imports');

module.exports = response = (res, data, code, instance) => {
    try {
        const { name = '', message } = data;

        if (errorTypes.includes(name)) {
            if (code) {
                res.status(code);
                let apiResponse = { message, instance }
                console.log({ apiResponse })
                return res.json(apiResponse);
            }

            console.log({ message })
            res.status(200);
            return res.json({ message });
        }
        res.status(code || 200)
        return res.json(data);
    } catch (exc) {
        const { Error: { error, status } } = new ErrorsFactory({ message: 'errorOccured' });

        res.status(status);
        console.log({ exc })

        res.send({ error });
    }
}