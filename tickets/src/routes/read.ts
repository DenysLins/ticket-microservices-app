import express from "express";
import {
  NotFoundError,
  BadRequestError,
} from "@denyslins-ticketing/common/dist/errors";
import { isValidId, Ticket } from "../models/ticket";

const router = express.Router();

router.get(
  "/api/tickets",
  async (req: express.Request, res: express.Response) => {
    const tickets = await Ticket.find({});

    res.status(200).send(tickets);
  }
);

router.get(
  "/api/tickets/:id",
  async (req: express.Request, res: express.Response) => {
    const { id } = req.params;

    if (!isValidId(id)) {
      throw new BadRequestError("Invalid order Id");
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    res.status(200).send(ticket);
  }
);

export { router as readRouter };
