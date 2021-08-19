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

router.get(
  "/api/tickets",
  currentUser,
  requireAuth,
  async (req: express.Request, res: express.Response) => {
    const tickets = await Ticket.find({});

    res.status(200).send(tickets);
  }
);

router.get(
  "/api/tickets/:id",
  currentUser,
  requireAuth,
  async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const ticket = await Ticket.findOne({ id });

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    res.status(200).send(ticket);
  }
);

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
    res.status(200).send(ticket);
  }
);

router.put(
  "/api/tickets",
  currentUser,
  requireAuth,
  ticketValidator,
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    const { title, price } = req.body;
    const user = req.currentUser;

    let ticket = await Ticket.findOne({ userId: user?.id });

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    ticket.title = title;
    ticket.price = price;

    ticket = await ticket.save();

    res.status(200).send(ticket);
  }
);

export { router as ticketsRouter };
