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
  UnauthorizedError,
} from "@denyslins-ticketing/common/dist/errors";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderUpdatedPublisher } from "../events/publishers/order-updated-publisher";

const router = express.Router();

router.put(
  "/api/orders/:id",
  currentUser,
  requireAuth,
  orderValidator,
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { title, price } = req.body;
    const user = req.currentUser;
    let order: any = null;
    try {
      order = await Order.findById(id);
    } catch (error) {
      throw new BadRequestError(
        "id must be a single String of 12 bytes or a string of 24 hex characters"
      );
    }

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.userId !== user?.id) {
      throw new UnauthorizedError("Unauthorized");
    }

    order.set({
      title,
      price,
    });

    order = await order.save();

    new OrderUpdatedPublisher(natsWrapper.client).publish({
      id: order.id,
      title: order.title,
      price: order.price,
      userId: order.userId,
    });

    res.status(200).send(order);
  }
);

export { router as updateRouter };
