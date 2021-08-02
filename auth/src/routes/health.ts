import express from "express";

const router = express.Router();

router.get("/api/users/health", (req, res) => {
  res.send({ status: "ok" });
});

export { router as healthRouter };
