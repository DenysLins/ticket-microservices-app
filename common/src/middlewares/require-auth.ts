import express from "express";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const requireAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.currentUser) {
    throw new UnauthorizedError("Unauthorized");
  }
  next();
};
