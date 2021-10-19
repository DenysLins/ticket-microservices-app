import { Message } from "node-nats-streaming";
import { Subjects } from "@denyslins-ticketing/common/dist/events/subjects";
import { Listener } from "@denyslins-ticketing/common/dist/events/base-listener";
import { TicketCreatedEvent } from "@denyslins-ticketing/common/dist/events/ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data: ", data);
    msg.ack();
  }
}
