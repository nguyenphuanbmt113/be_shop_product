const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
    },
    slug: {
      // required: true,
      type: String,
    },
    price: {
      required: true,
      type: Number,
    },
    discount: {
      type: Number,
    },
    stock: {
      required: true,
      type: Number,
    },
    category: {
      required: true,
      type: String,
    },
    colors: {
      type: [Map],
    },
    sizes: {
      type: [Map],
    },
    image1: {
      type: String,
      required: true,
    },
    image2: {
      type: String,
      required: true,
    },
    image3: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", productSchema);
