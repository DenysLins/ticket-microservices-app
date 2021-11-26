import mongoose from "mongoose";

import { randomBytes } from "crypto";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCanceledListener } from "./events/listeners/order-canceled-listener";

const TICKETS_PORT = process.env.TICKETS_PORT || 3000;
const TICKETS_MONGO_URL = process.env.TICKETS_MONGO_URL || "localhost";
const TICKETS_MONGO_PORT = process.env.TICKETS_MONGO_PORT || 27017;
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

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCanceledListener(natsWrapper.client).listen();

    await mongoose.connect(
      `mongodb://${TICKETS_MONGO_URL}:${TICKETS_MONGO_PORT}/tickets`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    console.log(
      `Connected to ticket-mongo in ${TICKETS_MONGO_URL}:${TICKETS_MONGO_PORT}`
    );

    app.listen(TICKETS_PORT, () => {
      console.log(`Tickets listening on port ${TICKETS_PORT}.`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
