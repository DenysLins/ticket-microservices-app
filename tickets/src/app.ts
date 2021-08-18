import * as dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "../.env.local" });
}

import express from "express";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import cookieSession from "cookie-session";

import { healthRouter } from "./routes/health";
import { ticketsRouter } from "./routes/tickets";
import { errorHandler } from "@denyslins-ticketing/common/dist/middlewares/error-handler";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());
app.use(helmet());

const COOKIE_KEY_1 = process.env.COOKIE_KEY_1 || "key_1";
const COOKIE_KEY_2 = process.env.COOKIE_KEY_2 || "key_2";

const secure = process.env.NODE_ENV === "production";

app.use(
  cookieSession({
    keys: [COOKIE_KEY_1, COOKIE_KEY_2],
    secure: secure,
  })
);

app.use(healthRouter);
app.use(ticketsRouter);

app.use(errorHandler);

export { app };
