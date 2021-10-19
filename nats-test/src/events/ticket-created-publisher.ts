import { Publisher } from "@denyslins-ticketing/common/dist/events/base-publisher";
import { TicketCreatedEvent } from "@denyslins-ticketing/common/dist/events/ticket-created-event";
import { Subjects } from "@denyslins-ticketing/common/dist/events/subjects";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
