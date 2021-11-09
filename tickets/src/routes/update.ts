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
  UnauthorizedError,
} from "@denyslins-ticketing/common/dist/errors";
import { isValidId, Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  currentUser,
  requireAuth,
  ticketValidator,
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    const userId = req.currentUser!.id;
    const { id } = req.params;
    const { title, price } = req.body;

    if (!isValidId(id)) {
      throw new BadRequestError("Invalid order Id");
    }
    let ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    if (ticket.userId !== userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    ticket.set({
      title,
      price,
    });

    ticket = await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(200).send(ticket);
  }
);

export { router as updateRouter };
