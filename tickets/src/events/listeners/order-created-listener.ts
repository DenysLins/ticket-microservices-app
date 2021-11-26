import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  OrderCreatedEvent,
} from "@denyslins-ticketing/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, ticket } = data;

    const t = await Ticket.findById(ticket.id);

    if (!t) {
      throw new Error("Ticket not found");
    }

    t.set({ orderId: id });

    await t.save();

    new TicketUpdatedPublisher(this.client).publish({
      id: t.id,
      price: t.price,
      title: t.title,
      userId: t.userId,
      orderId: t.orderId,
      version: t.version,
    });

    msg.ack();
  }
}
