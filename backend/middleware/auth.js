import jwt from "jsonwebtoken";
import blackListedToken from "../model/blackListedToken.js";

const auth = async (req, res, next) => {
  try {
    // Check for the token in the header
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).send({ error: "Authentication required." });
    }

    // Check if token is blacklisted
    const blacklisted = await blackListedToken.isTokenBlacklisted(token);
    if (blacklisted) {
      return res.status(401).send({ error: "This token is blacklisted." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Add user from the token to the request
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token or token expired." });
  }
};

export default auth;
