import express from "express";

const router = express.Router();

router.post("/api/users/signup", (req, res) => {
  res.send({ status: 200 });
});

export { router as signUpRouter };
