import { OrderStatus } from "@denyslins-ticketing/common/dist/events/types/order-status";
import express from "express";
import {
  currentUser,
  requireAuth,
} from "@denyslins-ticketing/common/dist/middlewares";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@denyslins-ticketing/common/dist/errors";
import { isValidId, Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCanceledPublisher } from "../events/publishers/order-canceled-publisher";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  currentUser,
  requireAuth,
  async (req: express.Request, res: express.Response) => {
    const userId = req.currentUser!.id;
    const { id } = req.params;

    if (!isValidId(id)) {
      throw new BadRequestError("Invalid order Id");
    }

    let order = await Order.findById(id).populate("ticket");

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.userId !== userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    order.status = OrderStatus.Cancelled;

    order = await order.save();

    await new OrderCanceledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(200).send(order);
  }
);

export { router as deleteRouter };
