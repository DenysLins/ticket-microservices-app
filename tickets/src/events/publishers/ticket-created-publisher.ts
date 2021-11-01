import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@denyslins-ticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
