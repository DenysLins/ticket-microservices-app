import express from "express";
import { invalidateJwt } from "../services/jwt";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  invalidateJwt(req);
  res.send({ status: "ok" });
});

export { router as signOutRouter };
