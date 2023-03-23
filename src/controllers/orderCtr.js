import asyncHandler from "express-async-handler";
import Order from "../model/orderModel";
const { validationResult } = require("express-validator");
import Review from "../model/reviewModal";
import Product from "../model/productModal";
export const getOrders = asyncHandler(async (req, res) => {
  const query = req.query;
  const page = req?.query?.page || 1;
  const option = query.userId ? { userId: query.userId } : {};
  try {
    const limit = 5;
    const skip = (page - 1) * limit;
    const orders = await Order.find(option)
      .populate("productId")
      .populate("userId")
      .limit(limit)
      .skip(skip)
      .sort("-updatedAt")
      .exec();
    const count = await Order.find(option).countDocuments();
    return res.status(200).json({
      mes: orders ? "get orders success" : "failed to get orders",
      orders,
      totalPage: Math.ceil(count / limit),
      count,
    });
  } catch (error) {
    throw new Error(error);
  }
});
export const getDetailOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id)
      .populate("productId")
      .populate("userId");
    return res.status(200).json({
      mes: order ? "get order success" : "failed to get order",
      details: order,
    });
  } catch (error) {
    throw new Error(error);
  }
});
export const addReviewComment = asyncHandler(async (req, res) => {
  const { rating, mes, userId, productId, orderId } = req.body;
  if (!rating) {
    throw new Error("Thiếu rating start");
  }
  if (!mes) {
    throw new Error("Thiếu message");
  }
  const createreiview = await Review.create({
    rating: +rating,
    comment: mes,
    user: userId,
    product: productId,
  });
  const orderReview = await Order.findByIdAndUpdate(orderId, {
    review: true,
  });
  const productReview = await Product.findByIdAndUpdate(productId, {
    $push: {
      reviews: createreiview._id,
    },
  });
  return res.status(200).json({
    mes: "review has created successfully",
  });
});
export const getReview = asyncHandler(async (req, res) => {
  const { productId } = req.query;
  if (!productId) throw new Error("Missing query input");
  const productReviews = await Review.find({
    product: productId,
  })
    .populate("user")
    .populate("product");
  return res.status(200).json({
    mes: "geting product is already success",
    productReviews,
  });
});
