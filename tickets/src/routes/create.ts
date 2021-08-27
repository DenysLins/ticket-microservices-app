import express from "express";
import {
  currentUser,
  requireAuth,
  ticketValidator,
  validateRequest,
} from "@denyslins-ticketing/common/dist/middlewares";
import { BadRequestError } from "@denyslins-ticketing/common/dist/errors";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.post(
  "/api/tickets",
  currentUser,
  requireAuth,
  ticketValidator,
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    const { title, price } = req.body;
    const user = req.currentUser;

    let ticket = await Ticket.findOne({ title, price, userId: user?.id });

    if (ticket) {
      throw new BadRequestError("Ticket already exists");
    }

    ticket = Ticket.build({
      title,
      price,
      userId: user?.id || "",
    });

    ticket = await ticket.save();
    res.status(201).send(ticket);
  }
);

export { router as createRouter };
