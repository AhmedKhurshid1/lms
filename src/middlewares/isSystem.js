/** Local dependencies & Services */
const { ErrorsFactory } = require("../factories");

const response = require("../libraries/response");

const { verifyToken } = require("./verifyToken");

const isSystem = (...args) => {
  try {
    const [req, res, next] = args;

    if (req.headers.authorization)
      req.headers.authorization = req.headers.authorization.replace(
        "Bearer ",
        ""
      );

    const decoded = verifyToken(
      /** injecting req, res, next to fulfuill the overloaded version of
       * the middleware function eventhough we do not need it. this is a tight
       * coupling that we need to eliminate in the future.
       * @todo Remove options from middleware, express middlewares do not have such an option
       */
      ...args,
      {
        asAServiceFunction: true,
      }
    );

    if (decoded.isSystem) req.headers.isSystem = true;

    next();
  } catch (exc) {
    const [req, res, next] = args;

    const { message } = exc;

    console.log(exc);

    const {
      Error: { error, status },
    } = new ErrorsFactory({ message });

    response(res, error, status);
  }
};

module.exports = {
  isSystem,
};
