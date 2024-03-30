import { ExpirationCompleteEvent, ListenerAbstract, OrderStatus, SubjectEnum } from "@sk_tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends ListenerAbstract<ExpirationCompleteEvent>{
    queueGroupName = queueGroupName;
    subject: SubjectEnum.ExpirationComplete = SubjectEnum.ExpirationComplete;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {

        const order = await Order.findById(data.orderId).populate("ticket");

        if (!order) {
            throw new Error('order not found');
        }
        if (order.status === OrderStatus.Complete) {
            msg.ack();
        }
        
        order.set({
            status: OrderStatus.Cancelled,
        });
        await order.save()

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
            }
        })
        console.log(order.ticket.id);
        msg.ack();
    }
}