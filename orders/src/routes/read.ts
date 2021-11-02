import express from "express";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "@denyslins-ticketing/common/dist/errors";
import { isValidId, Order } from "../models/order";
import {
  currentUser,
  requireAuth,
} from "@denyslins-ticketing/common/dist/middlewares";

const router = express.Router();

router.get(
  "/api/orders",
  currentUser,
  requireAuth,
  async (req: express.Request, res: express.Response) => {
    const userId = req.currentUser!.id;
    const orders = await Order.find({
      userId,
    }).populate("ticket");

    res.status(200).send(orders);
  }
);

router.get(
  "/api/orders/:id",
  currentUser,
  requireAuth,
  async (req: express.Request, res: express.Response) => {
    const userId = req.currentUser!.id;
    const { id } = req.params;

    if (!isValidId(id)) {
      throw new BadRequestError("Invalid order Id");
    }

    const order = await Order.findById(id).populate("ticket");

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.userId !== userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    res.status(200).send(order);
  }
);

export { router as readRouter };
