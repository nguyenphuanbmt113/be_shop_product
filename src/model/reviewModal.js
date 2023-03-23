const { Schema, model, Types } = require("mongoose");
const reviewsSchema = Schema(
  {
    rating: {
      type: Number,
      default: 1,
    },
    comment: {
      type: String,
    },
    product: { type: Types.ObjectId, ref: "Product" },
    user: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
module.exports = model("Review", reviewsSchema);
