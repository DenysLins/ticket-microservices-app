import express from "express";
import { currentUser } from "@denyslins-ticketing/common";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  (req: express.Request, res: express.Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
