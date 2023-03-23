import asyncHandler from "express-async-handler";
import _ from "lodash";
import Category from "../model/categoryModel";
export const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) throw new Error("Missing inputs");
  const category = await Category.create(req.body);
  return res.status(200).json({
    success: category ? true : false,
    mes: category ? "create categry okela" : "failed too create category!",
  });
});
export const getAllCategory = asyncHandler(async (req, res) => {
  const caterories = await Category.find();
  return res.status(200).json({
    success: caterories ? true : false,
    mes: caterories ? "get categies okela" : "failed too get categories!",
    caterories,
  });
});
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing params");
  const category = await Category.findByIdAndDelete(id);
  return res.status(200).json({
    success: category ? true : false,
    mes: category ? "delete okela" : "failed to delete",
  });
});
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  if (!title) {
    throw new Error("Missing inputs update");
  }
  if (!id) throw new Error("Missing params");
  const category = await Category.findByIdAndUpdate(
    id,
    { title },
    { new: true }
  );
  return res.status(200).json({
    success: category ? true : false,
    mes: category ? "update okela" : "failed to update",
  });
});
export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing params");
  const category = await Category.findById(id);
  return res.status(200).json({
    success: category ? true : false,
    mes: category ? "get category okela" : "failed to get category",
    category,
  });
});
export const getCateParagination = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const query = Category.find({})
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ updatedAt: -1 });
  const count = await Category.find({}).countDocuments();
  const caterories = await query;
  return res.status(200).json({
    success: caterories ? true : false,
    mes: caterories ? "get categies okela" : "failed too create categories!",
    caterories,
    currentPage: page,
    limit,
    count,
    totalPages: Math.ceil(count / limit),
  });
});
export const getRandomCategory = asyncHandler(async (req, res) => {
  const caterories = await Category.aggregate([{ $sample: { size: 5 } }]);
  return res.status(200).json({
    success: caterories ? true : false,
    mes: caterories
      ? "get random categies okela"
      : "failed too get random categories!",
    caterories,
  });
});
