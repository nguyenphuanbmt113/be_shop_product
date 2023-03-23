import express from "express";
import * as orderCtr from "../controllers/orderCtr";
import { verifyAccess } from "../middleware/verifyAccess";
const router = express.Router();

router.get("/get-order", [verifyAccess], orderCtr.getOrders);
router.get("/get-detailorder/:id", [verifyAccess], orderCtr.getDetailOrder);
router.post("/add-review", [verifyAccess], orderCtr.addReviewComment);
router.get("/get-reviews", [verifyAccess], orderCtr.getReview);

export default router;
