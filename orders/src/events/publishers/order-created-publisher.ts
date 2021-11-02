import {
  Publisher,
  Subjects,
  OrderCreatedEvent,
} from "@denyslins-ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
