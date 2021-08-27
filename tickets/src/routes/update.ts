import express from "express";
import {
  currentUser,
  requireAuth,
  ticketValidator,
  validateRequest,
} from "@denyslins-ticketing/common/dist/middlewares";
import {
  BadRequestError,
  NotFoundError,
} from "@denyslins-ticketing/common/dist/errors";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  currentUser,
  requireAuth,
  ticketValidator,
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { title, price } = req.body;
    const user = req.currentUser;
    let ticket: any = null;
    try {
      ticket = await Ticket.findOne({ _id: id });
    } catch (error) {
      throw new BadRequestError(
        "id must be a single String of 12 bytes or a string of 24 hex characters"
      );
    }

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    ticket.title = title;
    ticket.price = price;
    ticket.userId = user?.id;

    ticket = await ticket.save();

    res.status(200).send(ticket);
  }
);

export { router as updateRouter };
