const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/userMiddleware");

const {
  registerValidator,
  loginValidator,
} = require("../validators/userValidator");
const validate = require("../middleware/userValidator");

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);

router.get("/", protect, adminOnly, getUsers); // Lấy danh sách user
router.get("/:id", protect, adminOnly, getUser); // Lấy user theo ID
router.put("/:id", protect, adminOnly, updateUser); // Cập nhật user
router.delete("/:id", protect, adminOnly, deleteUser); // Xóa user

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
