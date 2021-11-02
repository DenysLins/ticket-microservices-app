import mongoose from "mongoose";
import { randomBytes } from "crypto";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const ORDERS_PORT = process.env.ORDERS_PORT || 3000;
const ORDERS_MONGO_URL = process.env.ORDERS_MONGO_URL || "localhost";
const ORDERS_MONGO_PORT = process.env.ORDERS_MONGO_PORT || 27017;
const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID || "ticketing";
const NATS_CLIENT_ID =
  process.env.NATS_CLIENT_ID || randomBytes(4).toString("hex");
const NATS_URL = process.env.NATS_URL || "nats";
const NATS_PORT = process.env.NATS_PORT || 4222;

const start = async () => {
  try {
    await natsWrapper.connect(
      NATS_CLUSTER_ID,
      NATS_CLIENT_ID,
      `http://${NATS_URL}:${NATS_PORT}`
    );
    console.log(`Connected to NATS in ${NATS_URL}:${NATS_PORT}`);

    natsWrapper.client.on("closed", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(
      `mongodb://${ORDERS_MONGO_URL}:${ORDERS_MONGO_PORT}/orders`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    console.log(
      `Connected to order-mongo in ${ORDERS_MONGO_URL}:${ORDERS_MONGO_PORT}`
    );

    app.listen(ORDERS_PORT, () => {
      console.log(`Auth listening on port ${ORDERS_PORT}.`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
