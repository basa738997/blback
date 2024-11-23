import express from "express";
import { loginController , logoutController, requestPasswordReset , resetPassword} from "../controllers/authController.js";
import { isAdmin, isLogin } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/login", loginController);
router.get("/logout", logoutController);
router.post('/requestOtp', requestPasswordReset);
router.post('/resetPassword', resetPassword);

router.get("/admin-auth", isLogin,isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
export default router;
