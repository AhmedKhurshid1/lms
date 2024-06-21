exports.authorizedRoles = function (roles) {
  // verifyToken
  return (req, res, next) => {
    let role = req.headers.User.role;
    if (role != roles) {
      throw new Error(`You are not authorized to access this resource`, 403);
    }
    next();
  };
};
``