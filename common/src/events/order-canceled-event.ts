import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";
import { TicketDoc } from "./types/ticket-doc";

export interface OrderCanceledEvent {
  subject: Subjects.OrderCanceled;
  data: {
    id: string;
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
  };
}
