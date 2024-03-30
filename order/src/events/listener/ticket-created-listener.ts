import { ListenerAbstract, SubjectEnum, TicketCreatedEventInterface } from "@sk_tickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends ListenerAbstract<TicketCreatedEventInterface>{
    subject: SubjectEnum.TicketCreated = SubjectEnum.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEventInterface['data'], msg: Message) {
        const { id,title, price } = data;

        const ticket = Ticket.build({
            id,
            title,
            price
        });
        console.log(title);
        await ticket.save();

        msg.ack();
    }
}