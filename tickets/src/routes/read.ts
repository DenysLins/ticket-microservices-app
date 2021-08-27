import express from "express";
import {
  NotFoundError,
  BadRequestError,
} from "@denyslins-ticketing/common/dist/errors";
import { Ticket } from "../models/ticket";

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

    res.status(200).send(ticket);
  }
);

export { router as readRouter };
