import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
export const createToken = (uid, role) => {
  const token = jwt.sign(
    {
      _id: uid,
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
};
export const verifyToken = asyncHandler((token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    throw new Error("can not verify token!");
  }
  return decoded;
});
