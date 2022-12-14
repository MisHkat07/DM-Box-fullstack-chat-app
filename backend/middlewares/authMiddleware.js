const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const { authToken } = req.cookies;

  if (authToken) {
    const decodeToken = await jwt.verify(authToken, process.env.JWT_SECRET);
    req.myId = decodeToken.id;
    next();
  } else {
   res.redirect("/login");
  }
};

module.exports = authMiddleware;
