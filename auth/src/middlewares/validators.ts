import { body } from "express-validator";

export const userAuthValidator = [
  body("email")
    .isEmail()
    .isLength({ max: 64 })
    .withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 6, max: 16 })
    .withMessage("Password must be between 6 and 20 characters"),
];
