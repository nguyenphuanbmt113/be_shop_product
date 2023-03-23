import asyncHandler from "express-async-handler";
import _ from "lodash";
import crypto from "crypto";
import { createToken } from "../config/jsonwebtoken";
import { sendEmail } from "../config/sendEmail";
import User from "../model/userModel";
export const register = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || !lastname || !email || !password) {
    throw new Error("Missing data");
  }
  const user = await User.create(req.body);
  return res.status(200).json({
    success: user ? 0 : -1,
    mes: user ? "Create user success" : "failed to create user",
    user,
  });
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Missing data");
  }
  const user = await User.findOne({
    email,
    role: "admin",
  });
  if (user && (await user.comparePassword(password))) {
    //tạo token
    const access_token = await createToken(user._id, user.role);
    return res.status(200).json({
      mes: "login user success",
      access_token: access_token,
      user: user,
    });
  } else {
    return res.status(500).json({
      success: -1,
      mes: "failed to login user",
    });
  }
});
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Missing data");
  }
  const user = await User.findOne({
    email,
    role: "user",
  });

  if (user && (await user.comparePassword(password))) {
    //tuserạo token
    const access_token = await createToken(user._id, user.role);
    return res.status(200).json({
      mes: "login user success",
      access_token: access_token,
      user,
    });
  } else {
    return res.status(500).json({
      success: -1,
      mes: "failed to login user",
    });
  }
});
export const fotgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({
    email,
  });
  if (!user) throw new Error("Can not found user");
  //tao token cho password
  const resetToken = await user.createPasswordChangedToken();
  await user.save();
  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.CLIENT_URL}/resetpassword/${resetToken}>Click here</a>`;
  const rs = await sendEmail({ email, html });
  return res.status(200).json({
    success: true,
    rs,
  });
});
export const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword, tokenReset } = req.body;
  if (!tokenReset) throw new Error("Can not reset password");
  if (!newPassword) throw new Error("Missing inputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(tokenReset)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: passwordResetToken,
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Updated password" : "Something went wrong",
  });
});
export const getUserQuery = asyncHandler(async (req, res) => {
  try {
    const queries = { ...req.query };
    const excludeFields = ["sort", "page"];
    excludeFields.forEach((ele) => {
      delete queries[ele];
    });
    let option = {};
    if (queries?.name) {
      option = {
        ...option,
        $or: [
          {
            firstname: { $regex: queries.name, $options: "i" },
          },
          {
            lastname: { $regex: queries.name, $options: "i" },
          },
        ],
      };
    }
    console.log("option:", option);
    let queryCommand = User.find(option);
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryCommand = queryCommand.sort(sortBy);
    }

    if (req.query.page) {
      const page = req.query.page * 1 || 1;
      const limit = 7;
      const skip = (page - 1) * limit;
      queryCommand = queryCommand.skip(skip).limit(limit);
    }
    //pagination
    queryCommand.exec(async (err, result) => {
      if (err) throw new Error(err.message);
      //số lượng sản phản thỏa mản đk
      const counts = await User.find(option).countDocuments();
      const limit = 7;
      const totalPage = Math.ceil(counts / limit);
      return res.status(200).json({
        success: result ? true : false,
        user: result ? result : "cannot get user",
        counts,
        totalPage,
      });
    });
  } catch (err) {
    if (err.name === "CastError")
      return new Error(`Invalid ${err.path}: ${err.value}`);
    return err;
  }
});
export const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  console.log("id:", req.body);
  if (!id) throw new Error("Missing req.body");
  const userFind = await User.findById(id);
  if (userFind) {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlock: !userFind.isBlock,
      },
      { new: true }
    );
    return res.status(200).json({
      mes: "Block user is success!",
      user,
    });
  }
});
export const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) throw new Error("Missing req.body");
  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlock: false,
    },
    { new: true }
  );
  return res.status(200).json({
    mes: "UnBlock user is success!",
    user,
  });
});
