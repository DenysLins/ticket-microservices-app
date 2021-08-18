import express from "express";

import {
  userValidator,
  validateRequest,
  Unauthorized,
  Password,
  generateJwt,
} from "@denyslins-ticketing/common";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signin",
  userValidator,
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Unauthorized("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(user.password, password);

    if (!passwordsMatch) {
      throw new Unauthorized("Invalid credentials");
    }

    generateJwt(user, req);

    res.status(200).send(user);
  }
);

export { router as signInRouter };
