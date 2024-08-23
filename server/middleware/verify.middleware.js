/* external imports */
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

async function verify(req, res, next) {
  try {
    // catch the token from user header
    console.log(111, req.headers?.authorization);
    const token = req.headers?.authorization?.split(" ")[1];

    // no token explicitly give error
    if (!token) {
      console.log(666);
      return res.status(401).json({
        acknowledgement: false,
        message: "zuck",
        description: "No token found to persist an existing user for long time",
      });
    }

    // fetching token set the user on request
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.TOKEN_SECRET
    );
    req.user = decoded;
console.log(decoded);
    next();
  } catch (error) {
    res.status(401).json({
      acknowledgement: false,
      message: "Unauthorized",
      description: "Sign in your account to continue",
    });
  }
}

/* export token verification */
module.exports = verify;
