import { ListenerAbstract, OrderCreatedEvent, SubjectEnum } from "@sk_tickets/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends ListenerAbstract<OrderCreatedEvent> {
    subject: SubjectEnum.OrderCreated = SubjectEnum.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log(data);
    
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay
        });

        msg.ack();
    }
}