import express from "express";
import { verifyJwt } from "../services/jwt";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const payload = verifyJwt(req.session?.jwt) as UserPayload;
    req.currentUser = payload;
    next();
  } catch (error) {
    next();
  }
};
