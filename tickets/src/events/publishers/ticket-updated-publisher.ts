import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@denyslins-ticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
