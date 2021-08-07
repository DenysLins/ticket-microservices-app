import express from "express";

import { userValidator, validateRequest } from "../middlewares/validators";
import { User } from "../models/user";
import { Password } from "./../services/password";
import { generateJwt } from "../services/jwt";
import { Unauthorized } from "../errors/unauthorized-error";

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
