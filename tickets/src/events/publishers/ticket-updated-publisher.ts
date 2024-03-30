import { SubjectEnum, TicketUpdatedEventInterface ,PublisherAbstract } from "@sk_tickets/common";

export class TicketUpdatedPublisher extends PublisherAbstract<TicketUpdatedEventInterface>{
    subject: SubjectEnum.TicketUpdated = SubjectEnum.TicketUpdated;
}