import express from "express";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  res.send({ status: 200 });
});

export { router as currentUserRouter };
