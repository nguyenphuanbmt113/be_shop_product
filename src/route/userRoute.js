import express from "express";
import * as handleCtr from "../controllers/userCtr";
import { isAdmin, verifyAccess } from "../middleware/verifyAccess";
const router = express.Router();
router.post("/register", handleCtr.register);
router.post("/login", handleCtr.login);
router.post("/login-user", handleCtr.loginUser);
router.post("/forgotPassword", handleCtr.fotgotPassword);
router.put("/resetpassword", handleCtr.resetPassword);
router.get("/get-users", handleCtr.getUserQuery);
router.put("/block", handleCtr.blockUser);
router.put("/unblock", handleCtr.unblockUser);

export default router;
