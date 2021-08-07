import { verifyJwt } from "./../services/jwt";
import express from "express";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  (req: express.Request, res: express.Response) => {
    const token = req.session?.jwt;

    try {
      const payload = verifyJwt(token);
      return res.send({ currentUser: payload });
    } catch (error) {
      return res.send({ currentUser: null });
    }
  }
);

export { router as currentUserRouter };
