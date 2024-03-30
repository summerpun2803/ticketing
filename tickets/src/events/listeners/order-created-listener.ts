import { ListenerAbstract, OrderCreatedEvent, OrderStatus, SubjectEnum } from "@sk_tickets/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends ListenerAbstract<OrderCreatedEvent> {
    subject: SubjectEnum.OrderCreated = SubjectEnum.OrderCreated
    queueGroupName = queueGroupName;

    async onMessage(data:OrderCreatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        console.log(data);
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({ orderId: data.id });
        await ticket.save();

        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        })

        msg.ack();
    }
}