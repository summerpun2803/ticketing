import { OrderCancelledEvent, PublisherAbstract, SubjectEnum } from "@sk_tickets/common";

export class OrderCancelledPublisher extends PublisherAbstract<OrderCancelledEvent>{
    subject: SubjectEnum.OrderCancelled = SubjectEnum.OrderCancelled;
}