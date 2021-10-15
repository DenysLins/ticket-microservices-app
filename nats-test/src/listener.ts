import { randomBytes } from "crypto";
import nats, { Message } from "node-nats-streaming";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("closed", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("ticket-service");

  const subscription = stan.subscribe(
    "ticket-created",
    "ticket-queue-group",
    options
  );

  subscription.on("message", (msg: Message) => {
    console.log(msg.getSequence(), msg.getData());
    msg.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
