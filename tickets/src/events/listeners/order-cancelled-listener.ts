import { ListenerAbstract, OrderCancelledEvent, SubjectEnum } from "@sk_tickets/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends ListenerAbstract<OrderCancelledEvent>{
    subject: SubjectEnum.OrderCancelled = SubjectEnum.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        console.log(data);
        const ticket = await Ticket.findById(data.ticket.id);
        console.log(ticket);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        
        ticket.set({ orderId: undefined });
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            userId: ticket.userId,
            price: ticket.price,
            title: ticket.title,
            version: ticket.version,
        })
        msg.ack();
    }
}