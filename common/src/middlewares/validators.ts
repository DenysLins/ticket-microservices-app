import mongoose from "mongoose";
import express, { NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

export const userValidator = [
  body("email")
    .isEmail()
    .isLength({ max: 64 })
    .withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 6, max: 16 })
    .withMessage("Password must be between 6 and 16 characters"),
];

export const ticketValidator = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 64 })
    .withMessage("Title must be valid"),
  body("price")
    .trim()
    .isLength({ max: 16 })
    .isString()
    .isCurrency()
    .custom((price) => Number(price) >= 0)
    .withMessage("Price must be valid"),
];

export const orderValidator = [
  body("ticketId")
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("ticketId must be provided"),
];

export const validateRequest = (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  next();
};
