import express from "express";
import * as paymentCtr from "../controllers/paymentCtr";
import { verifyAccess } from "../middleware/verifyAccess";
require("dotenv").config();

const router = express.Router();
router.post(
  "/create-checkout-session",
  verifyAccess,
  paymentCtr.paymentHandler
);
router.get("/verify-payment/:id", paymentCtr.paymentVerify);
export default router;
