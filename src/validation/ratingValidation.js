const { body } = require("express-validator");

module.exports = [
  body("rating")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .trim()
    .withMessage("Cần bổ sung đánh giá sao"),
];
