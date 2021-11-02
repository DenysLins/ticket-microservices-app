import express from "express";
import {
  currentUser,
  requireAuth,
  orderValidator,
  validateRequest,
} from "@denyslins-ticketing/common/dist/middlewares";
import { BadRequestError } from "@denyslins-ticketing/common/dist/errors";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/orders",
  currentUser,
  requireAuth,
  orderValidator,
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    const { title, price } = req.body;
    const user = req.currentUser;

    let order = await Order.findOne({ title, price, userId: user?.id });

    if (order) {
      throw new BadRequestError("Order already exists");
    }

    order = Order.build({
      title,
      price,
      userId: user?.id || "",
    });

    order = await order.save();

    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      title: order.title,
      price: order.price,
      userId: order.userId,
    });

    res.status(201).send(order);
  }
);

export { router as createRouter };
