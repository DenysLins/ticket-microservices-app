import {
  Publisher,
  Subjects,
  OrderCanceledEvent,
} from "@denyslins-ticketing/common";

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
}
