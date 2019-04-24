const User = require("../Models/User");
const isLogged = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const userLogged = await User.findOne({
      "public.token": req.headers.authorization.split(" ")[1]
    });
    if (userLogged) {
      req.user = userLogged;
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = isLogged;
