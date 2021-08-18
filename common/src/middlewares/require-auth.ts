import express from "express";
import { Unauthorized } from "../errors/unauthorized-error";

export const requireAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.currentUser) {
    throw new Unauthorized("Not authorized");
  }
  next();
};
