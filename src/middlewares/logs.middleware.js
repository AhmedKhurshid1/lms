const { Errors } = require("../imports");
const response = require("../libraries/response");
const {
  createDocument,
  findDocument,
} = require("../modules/utils/queryFunctions");

const createLogs = async (type, req, err) => {
  let userIdToUse = req.headers.User && req.headers.User.userId;
  if (req.path == "/login" && !userIdToUse) {
    foundUser = await findDocument("Users", {
      emailAddress: req.body.emailAddress,
      raw: true
    });
    userIdToUse = foundUser?.userId;
  }
  if(req.path == "/deleteAccount"){
    userIdToUse= null;
  }
  let payload = {
    userId: userIdToUse || null,
    type, endpoint: req.originalUrl, method: req.method,
  }
  if (type == "Error") payload.reason = err || "Error"
  await createDocument('Logs', payload)
};

module.exports = {
  createLogs,
};
