import { DatabaseConnectionError } from "./../errors/database-connection-error";
import { RequestValidationError } from "./../errors/request-validation-error";
import express from "express";

export const errorHandler = (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (err instanceof RequestValidationError) {
    const formattedErrors = err.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
    return res.status(400).send({
      errors: formattedErrors,
    });
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(503).send({
      errors: [
        {
          message: err.reason,
        },
      ],
    });
  }

  return res.status(500).send({
    errors: [
      {
        message: err.message,
      },
    ],
  });
};
