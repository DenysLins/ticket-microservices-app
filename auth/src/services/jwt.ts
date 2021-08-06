import * as dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "../.env.local" });
}
const JWT_KEY = process.env.JWT_KEY || "jwt_key";

export const generateJwt = (user: any, req: express.Request) => {
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_KEY
  );

  req.session = {
    jwt: userJwt,
  };
};
