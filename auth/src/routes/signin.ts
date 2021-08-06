import express from "express";

import { userAuthValidator, validateRequest } from "../middlewares/validators";
import { User } from "../models/user";
import { Password } from "./../services/password";
import { generateJwt } from "../services/jwt";
import { Unauthorized } from "../errors/unauthorized";
import { NotFound } from "./../errors/not-found";

const router = express.Router();

router.post(
  "/api/users/signin",
  userAuthValidator,
  async (req: express.Request, res: express.Response) => {
    validateRequest(req);

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new NotFound("User email not found");
    }

    const validPassword = await Password.compare(
      existingUser.password,
      password
    );

    if (!validPassword) {
      throw new Unauthorized("Wrong Password");
    }

    generateJwt(existingUser, req);

    res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
