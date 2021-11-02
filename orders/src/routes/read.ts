import express from "express";
import {
  NotFoundError,
  BadRequestError,
} from "@denyslins-ticketing/common/dist/errors";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders",
  async (req: express.Request, res: express.Response) => {
    const orders = await Order.find({});

    res.status(200).send(orders);
  }
);

router.get(
  "/api/orders/:id",
  async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
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

    res.status(200).send(order);
  }
);

export { router as readRouter };
