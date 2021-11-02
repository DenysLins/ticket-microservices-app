import { OrderStatus } from "./types/order-status";
import { Subjects } from "./subjects";
import { TicketDoc } from "./types/ticket-doc";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
  };
}
