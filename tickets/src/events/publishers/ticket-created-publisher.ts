import { PublisherAbstract, SubjectEnum, TicketCreatedEventInterface } from "@sk_tickets/common";

export class TicketCreatedPublisher extends PublisherAbstract<TicketCreatedEventInterface>{
    subject: SubjectEnum.TicketCreated = SubjectEnum.TicketCreated

}