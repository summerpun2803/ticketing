import { ExpirationCompleteEvent, PublisherAbstract, SubjectEnum } from "@sk_tickets/common";

export class ExpirationCompletePublisher extends PublisherAbstract<ExpirationCompleteEvent>{
    subject: SubjectEnum.ExpirationComplete = SubjectEnum.ExpirationComplete
}