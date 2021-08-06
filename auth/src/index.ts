import * as dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import cookieSession from "cookie-session";

import { healthRouter } from "./routes/health";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "../.env.local" });
}

const COOKIE_KEY_1 = process.env.COOKIE_KEY_1 || "key_1";
const COOKIE_KEY_2 = process.env.COOKIE_KEY_2 || "key_2";
const AUTH_MONGO_URL = process.env.AUTH_MONGO_URL || "localhost";
const AUTH_MONGO_PORT = process.env.AUTH_MONGO_PORT || 27017;
const AUTH_PORT = process.env.AUTH_PORT || 3000;

app.use(
  cookieSession({
    keys: [COOKIE_KEY_1, COOKIE_KEY_2],
    secure: true,
  })
);

app.use(healthRouter);
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb://${AUTH_MONGO_URL}:${AUTH_MONGO_PORT}/auth`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    console.log("Connected to auth-mongo.");
  } catch (error) {
    console.error(error);
  }

  app.listen(AUTH_PORT, () => {
    console.log(`Auth listening on port ${AUTH_PORT}.`);
  });
};

start();
