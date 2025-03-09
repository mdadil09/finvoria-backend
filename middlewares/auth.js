const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    token = token.split(" ")[1];

    if (token === null || !token) {
      return res.status(401).send("Unauthorized request");
    }

    let verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET);

    if (!verifiedUser) {
      return res.status(401).send("Unauthorized request");
    }

    req.user = verifiedUser;

    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
    console.log(error.message);
  }
};

module.exports = protect;
