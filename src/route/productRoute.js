import express from "express";
import * as productCtr from "../controllers/productCtr";
import { isAdmin, verifyAccess } from "../middleware/verifyAccess";
const router = express.Router();
router.post("/create", [verifyAccess, isAdmin], productCtr.createProduct);
// router.get("/all", categoryCtr.getAllCategory);
router.get(
  "/get-product",
  [verifyAccess, isAdmin],
  productCtr.getProductsByQuery
);
router.get("/search/:keyword/:page?", productCtr.searchProduct);
router.delete("/delete/:id", [verifyAccess, isAdmin], productCtr.deleteProduct);
router.put("/update/:id", [verifyAccess, isAdmin], productCtr.updateProduct);
router.get("/:id", productCtr.getProduct);
router.get("/cat-product/:name/:page?", productCtr.getCateProduct);

export default router;
