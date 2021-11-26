import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  OrderCanceledEvent,
} from "@denyslins-ticketing/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCanceledEvent["data"], msg: Message) {
    const { ticket } = data;

    const t = await Ticket.findById(ticket.id);

    if (!t) {
      throw new Error("Ticket not found");
    }

    t.set({ orderId: undefined });

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
