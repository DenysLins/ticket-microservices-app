import { Subjects } from "./subjects";

export interface OrderUpdatedEvent {
  subject: Subjects.OrderUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
