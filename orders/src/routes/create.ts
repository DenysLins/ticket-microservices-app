import express from "express";
import {
  currentUser,
  requireAuth,
  orderValidator,
  validateRequest,
} from "@denyslins-ticketing/common/dist/middlewares";
import {
  BadRequestError,
  NotFoundError,
} from "@denyslins-ticketing/common/dist/errors";
import { Order, OrderStatus } from "../models/order";
import { Ticket } from "../models/ticket";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  currentUser,
  requireAuth,
  orderValidator,
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    const { ticketId } = req.body;
    const userId = req.currentUser!.id;

    const ticket = await Ticket.findOne({ _id: ticketId });

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    let order = Order.build({
      userId: userId,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    order = await order.save();

    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createRouter };
