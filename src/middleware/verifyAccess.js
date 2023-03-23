import asyncHandler from "express-async-handler";
import { verifyToken } from "../config/jsonwebtoken";
export const verifyAccess = asyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];
    //verify token
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } else {
    return res.status(401).json({
      success: false,
      mes: "Require authentication!!!",
    });
  }
});
export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    return res.status(401).json({
      success: false,
      mes: "You are not admin access!",
    });
  }
});
