import express from "express";
import * as categoryCtr from "../controllers/categoryCtr";
import { isAdmin, verifyAccess } from "../middleware/verifyAccess";
const router = express.Router();
router.post("/create", [verifyAccess, isAdmin], categoryCtr.createCategory);
router.get("/all", categoryCtr.getAllCategory);
router.get(
  "/get-catequery",
  [verifyAccess, isAdmin],
  categoryCtr.getCateParagination
);
router.get("/random-category", categoryCtr.getRandomCategory);
router.delete(
  "/delete/:id",
  [verifyAccess, isAdmin],
  categoryCtr.deleteCategory
);
router.put("/update/:id", [verifyAccess, isAdmin], categoryCtr.updateCategory);
router.get("/:id", categoryCtr.getCategoryById);
router.get("/all", categoryCtr.getAllCategory);

export default router;
