const mongoose = require("mongoose"); // Erase if already required
import bcrypt from "bcrypt";
import crypto from "crypto";
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  isAuthentication: {
    type: String,
    default: false,
  },
  isBlock: {
    type: Boolean,
    default: false,
  },
  fresh_token: {
    type: String,
  },
  passwordchangedAt: {
    type: String,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpire: {
    type: String,
  },
});
userSchema.pre("save", async function hashpassword(next) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hashSync(this.password, salt);
});
//comparePassword
userSchema.methods = {
  comparePassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
  createPasswordChangedToken: function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
  },
};

//Export the model
module.exports = mongoose.model("User", userSchema);
