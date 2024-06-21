/** Local dependencies & Services */
const { ErrorsFactory } = require("../factories");

const response = require("../libraries/response");

const { verifyToken } = require("./verifyToken");

const isAdministrator = (...args) => {  
  try {
    const decoded = verifyToken(...args, {
      asAServiceFunction: true,
    });

    if (decoded.isAdministrator) return true;

    throw new Error('AccessForbidden');
  } catch (exc) {
    const { message } = exc;

    console.log(exc);

    const {
      Error: { error, status },
    } = new ErrorsFactory({ message });

    response(res, error, status);
  }
};

module.exports = {
  isAdministrator,
};
