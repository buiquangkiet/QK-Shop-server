const { body } = require("express-validator");
const User = require("../models/User");

exports.registerValidator = [
  body("firstName").notEmpty().withMessage("Vui lòng điền first name"),
  body("lastName").notEmpty().withMessage("Vui lòng điền last name"),
  body("email").notEmpty().withMessage('Vui lòng nhập email').bail()
    .isEmail().withMessage('Email không hợp lệ').bail()
    .custom(async (email) => {
      const exitsingUser = await User.findOne({ email });
      if (exitsingUser) {
        throw new Error("Email đã được sử dụng")
      }
      return true;
    }),
];

exports.loginValidator = [
  body("email").notEmpty().withMessage('Vui lòng nhập email').bail().isEmail().withMessage("Email không hợp lệ"),
  body("password").notEmpty().withMessage("Vui lòng nhập mật khẩu"),
];
