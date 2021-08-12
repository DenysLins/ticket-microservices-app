import express from "express";

import { userValidator, validateRequest } from "../middlewares/validators";
import { BadRequestError } from "../errors/bad-request-error";
import { generateJwt } from "./../services/jwt";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  userValidator,
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    const user = User.build({
      email,
      password,
    });

    await user.save();

    generateJwt(user, req);

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
