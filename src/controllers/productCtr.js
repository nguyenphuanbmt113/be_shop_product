import asyncHandler from "express-async-handler";
var slugify = require("slugify");
import _ from "lodash";
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const { v4: uuidv4 } = require("uuid");
import Product from "../model/productModal";
export const createProduct = asyncHandler(async (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (!err) {
      const parsedData = JSON.parse(fields.data);
      const images = {};
      for (let i = 0; i < Object.keys(files).length; i++) {
        const mimeType = files[`image${i + 1}`].mimetype;
        const extension = mimeType.split("/")[1].toLowerCase();
        if (
          extension === "jpeg" ||
          extension === "jpg" ||
          extension === "png"
        ) {
          const imageName = uuidv4() + `.${extension}`;
          const __dirname = path.resolve();
          const newPath = __dirname + `/../client/public/images/${imageName}`;
          images[`image${i + 1}`] = imageName;
          fs.copyFile(files[`image${i + 1}`].filepath, newPath, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
      }
      try {
        const response = await Product.create({
          title: parsedData.title,
          slug: slugify(parsedData.title, "-"),
          price: parseInt(parsedData.price),
          discount: parseInt(parsedData.discount),
          stock: parseInt(parsedData.stock),
          category: parsedData.category,
          colors: parsedData.colors,
          sizes: JSON.parse(fields.sizes),
          image1: images["image1"],
          image2: images["image2"],
          image3: images["image3"],
          description: fields.description,
        });
        return res.status(200).json({ msg: "Product has created", response });
      } catch (error) {
        console.log(">>>>>>>.check :", error);
      }
    }
  });
});
export const getProductsByQuery = asyncHandler(async (req, res) => {
  try {
    //Tách các trường đặc biệt ra khỏi query
    console.log("query em oi:", req.query);
    const queries = { ...req.query };
    const excludeFields = ["limit", "sort", "page", "fields"];
    //xoá các query dac biet
    excludeFields.forEach((ele) => {
      delete queries[ele];
    });
    let queryString = JSON.stringify(queries);

    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (macthed) => `$${macthed}`
    );
    const formatedQueries = JSON.parse(queryString);
    //filtering tile
    if (queries?.title) {
      formatedQueries.title = { $regex: queries.title, $options: "i" };
    }
    //số lượng sản phản thỏa mản đk !== số lượng sản phẩm trả về một lần
    let queryCommand = Product.find(formatedQueries);
    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryCommand = queryCommand.sort(sortBy);
    }
    //fields, limited
    if (req.query.fields) {
      const fieldsBy = req.query.fields.split(" ").join(" "); //string ->split->array   //array->join->string
      queryCommand = queryCommand.select(fieldsBy);
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
      const counts = await Product.find(formatedQueries).countDocuments();
      const limit = 7;
      const totalPage = Math.ceil(counts / limit);
      return res.status(200).json({
        success: result ? true : false,
        products: result ? result : "cannot get products",
        counts,
        totalPage,
        // totalPage: Math.ceil(counts / limit)
      });
    });
  } catch (err) {
    if (err.name === "CastError")
      return new Error(`Invalid ${err.path}: ${err.value}`);
    return err;
  }
});
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    _id,
    title,
    price,
    discount,
    stock,
    colors,
    sizes,
    description,
    category,
  } = req.body;
  if (_.isEmpty(req.body)) {
    throw new Error("Missing inputs");
  }
  const response = await Product.updateOne(
    { _id },
    {
      $set: {
        title,
        price,
        discount,
        stock,
        category,
        colors,
        sizes,
        description,
      },
    }
  );
  return res.status(200).json({
    msg: response ? "Product has updated" : "failed to update user",
    response: response ? response : "",
    success: response ? true : false,
  });
});
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ _id: id }).populate("reviews");
    return res.status(200).json(product);
  } catch (error) {
    throw new Error(error);
  }
});
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ _id: id });
    [1, 2, 3].forEach((number) => {
      let key = `image${number}`;
      let image = product[key];
      let __dirname = path.resolve();
      let imagePath = __dirname + `/../client/public/images/${image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          throw new Error(err);
        }
      });
    });
    await Product.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ msg: "Product has been deleted successfully" });
  } catch (error) {
    throw new Error(error.message);
  }
});
export const getCateProduct = asyncHandler(async (req, res) => {
  const { name, page } = req.params;
  if (page) {
    let limit = 12;
    let offset = limit * (page - 1);
    const product = await Product.find({
      category: name,
    })
      .limit(limit)
      .populate("reviews")
      .skip(offset)
      .sort("-createdAt")
      .where("stock")
      .gt(0);
    const count = await Product.find({
      category: name,
    })
      .where("stock")
      .gt(0)
      .countDocuments();
    const totalPage = Math.ceil(count / limit);
    return res.status(200).json({
      success: product ? true : false,
      mes: product
        ? "Get category products success"
        : "failed to get category products",
      product,
      totalPage,
      count,
    });
  } else {
    const product = await Product.find({
      category: name,
    })
      .where("stock")
      .gt(0)
      .limit(4)
      .sort("-updatedAt")
      .populate("reviews");
    return res.status(200).json({
      success: product ? true : false,
      mes: product ? "get product success" : "failed to get product",
      product,
    });
  }
});
export const searchProduct = asyncHandler(async (req, res) => {
  const { name, page, keyword } = req.params;
  const options = name
    ? { category: name }
    : keyword && {
        title: {
          $regex: `${keyword}`,
          $options: "i",
        },
      };
  if (page) {
    let limit = 12;
    let offset = limit * (page - 1);
    const product = await Product.find({
      ...options,
    })
      .limit(limit)
      .skip(offset)
      .sort("-createdAt")
      .where("stock")
      .gt(0)
      .populate("reviews");
    const count = await Product.find({
      ...options,
    })
      .where("stock")
      .gt(0)
      .countDocuments();
    const totalPage = Math.ceil(count / limit);
    return res.status(200).json({
      success: product ? true : false,
      mes: product
        ? "Get search products success"
        : "failed to get search products",
      product,
      totalPage,
      count,
    });
  } else {
    const product = await Product.find({
      category: name,
    })
      .where("stock")
      .gt(0)
      .limit(4)
      .sort("-updatedAt")
      .populate("reviews");
    return res.status(200).json({
      success: product ? true : false,
      mes: product ? "get product success" : "failed to get product",
      product,
    });
  }
});
export const getSearchBar = asyncHandler(async (req, res) => {
  
});
