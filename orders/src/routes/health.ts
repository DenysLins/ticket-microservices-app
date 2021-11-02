import express from "express";
import {
  currentUser,
  requireAuth,
} from "@denyslins-ticketing/common/dist/middlewares";

const router = express.Router();

router.get("/api/orders/health", (req, res) => {
  res.send({ status: "ok" });
});

router.get(
  "/api/orders/health-protected",
  currentUser,
  requireAuth,
  (req, res) => {
    res.send({ status: "ok" });
  }
);

export { router as healthRouter };
