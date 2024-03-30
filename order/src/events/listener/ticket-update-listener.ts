import { ListenerAbstract, SubjectEnum, TicketUpdatedEventInterface } from "@sk_tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";


export class TicketUpdatedListener extends ListenerAbstract<TicketUpdatedEventInterface>{
    subject: SubjectEnum.TicketUpdated = SubjectEnum.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEventInterface['data'], msg: Message) {
        
        const ticket = await Ticket.findOne({
            _id: data.id,
            version: data.version - 1
        });
        if (!ticket) throw new Error('Ticket not found');

        const { title, price } = data;
        ticket.set({ title, price });
        
        await ticket.save();

        msg.ack();
    }
}