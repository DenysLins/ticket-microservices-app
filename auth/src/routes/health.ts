import express from "express";
import { currentUser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";

const router = express.Router();

router.get("/api/users/health", (req, res) => {
  res.send({ status: "ok" });
});

router.get(
  "/api/users/health-protected",
  currentUser,
  requireAuth,
  (req, res) => {
    res.send({ status: "ok" });
  }
);

export { router as healthRouter };
