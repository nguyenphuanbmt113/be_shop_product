import express from "express";
import * as orderCtr from "../controllers/orderCtr";
import { verifyAccess, isAdmin } from "../middleware/verifyAccess";
const router = express.Router();

router.get("/get-order", [verifyAccess, isAdmin], orderCtr.getOrders);
router.get(
  "/get-detailorder/:id",
  [verifyAccess, isAdmin],
  orderCtr.getDetailOrder
);

export default router;
