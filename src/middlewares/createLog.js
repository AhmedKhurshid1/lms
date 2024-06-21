const logMiddleware = (req, res, next) => {
    const log = {
        url: req.path,
        method: req.method,
        type: 'Success'
      };
}


module.exports = {
    logMiddleware
}