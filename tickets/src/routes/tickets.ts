import express from "express";
import {
  currentUser,
  requireAuth,
  ticketValidator,
  validateRequest,
} from "@denyslins-ticketing/common/dist/middlewares";
import { Unauthorized } from "@denyslins-ticketing/common/dist/errors/unauthorized-error";

import { Ticket } from "../models/ticket";
import { NotFound } from "@denyslins-ticketing/common";

const router = express.Router();

router.get(
  "/api/tickets",
  currentUser,
  requireAuth,
  async (req: express.Request, res: express.Response) => {
    const tickets = await Ticket.find({});

    if (!tickets) {
      throw new NotFound("Tickets not found");
    }

    res.status(200).send(tickets);
  }
);

router.get(
  "/api/tickets/:id",
  currentUser,
  requireAuth,
  async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const tickets = await Ticket.findOne({ id });

    if (!tickets) {
      throw new NotFound("Tickets not found");
    }

    res.status(200).send(tickets);
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

    const ticket = await Ticket.findOne({ title, price });

    if (!ticket) {
      throw new Unauthorized("Invalid credentials");
    }

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

    const ticket = await Ticket.findOne({ title, price });

    if (!ticket) {
      throw new Unauthorized("Invalid credentials");
    }

    res.status(200).send(ticket);
  }
);

export { router as ticketsRouter };
