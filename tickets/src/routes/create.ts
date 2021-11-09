import express from "express";
import {
  currentUser,
  requireAuth,
  ticketValidator,
  validateRequest,
} from "@denyslins-ticketing/common/dist/middlewares";
import { BadRequestError } from "@denyslins-ticketing/common/dist/errors";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createRouter };
