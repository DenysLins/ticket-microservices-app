import express from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  return res.status(500).send({
    errors: [
      {
        message: err.message,
      },
    ],
  });
};
