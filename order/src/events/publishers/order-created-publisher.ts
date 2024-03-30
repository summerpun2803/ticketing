import { OrderCreatedEvent, PublisherAbstract, SubjectEnum } from "@sk_tickets/common";

export class OrderCreatedPublisher extends PublisherAbstract<OrderCreatedEvent>{
    subject: SubjectEnum.OrderCreated = SubjectEnum.OrderCreated;
}