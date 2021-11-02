import {
  Publisher,
  Subjects,
  OrderUpdatedEvent,
} from "@denyslins-ticketing/common";

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
}
