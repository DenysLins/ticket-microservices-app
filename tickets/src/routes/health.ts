import express from "express";
import {
  currentUser,
  requireAuth,
} from "@denyslins-ticketing/common/dist/middlewares";

const router = express.Router();

router.get("/api/tickets/health", (req, res) => {
  res.send({ status: "ok" });
});

router.get(
  "/api/tickets/health-protected",
  currentUser,
  requireAuth,
  (req, res) => {
    res.send({ status: "ok" });
  }
);

export { router as healthRouter };
