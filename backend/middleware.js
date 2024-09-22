import jwt from "jsonwebtoken";
import { JWTSECRET } from "./constant.js";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ msg: "Token not provided or invalid format" });
  }
  try {
    const decoded = jwt.verify(token, JWTSECRET);
    console.log(decoded);
    req.user = decoded.userId;

    next();
  } catch (err) {
    return res.status(403).json({ msg: "Token invalid or expired" });
  }
};

export default authMiddleware;
