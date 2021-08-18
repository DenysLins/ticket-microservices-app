import express from "express";
import jwt from "jsonwebtoken";

const JWT_KEY = process.env.JWT_KEY || "jwt_key";
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || 3600;

export const generateJwt = (user: any, req: express.Request) => {
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_KEY,
    {
      expiresIn: Number(JWT_EXPIRATION_TIME),
    }
  );

  req.session = {
    jwt: userJwt,
  };
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, JWT_KEY);
};

export const invalidateJwt = (req: express.Request) => {
  req.session = null;
};
