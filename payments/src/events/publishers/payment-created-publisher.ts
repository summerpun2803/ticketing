import { PaymentCreatedEvent, PublisherAbstract, SubjectEnum } from "@sk_tickets/common";

export class PaymentCreatedPublisher extends PublisherAbstract<PaymentCreatedEvent>{
    subject: SubjectEnum.PaymentCreated = SubjectEnum.PaymentCreated
}