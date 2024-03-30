import { ListenerAbstract, OrderStatus, PaymentCreatedEvent, SubjectEnum } from "@sk_tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends ListenerAbstract<PaymentCreatedEvent>{
    subject: SubjectEnum.PaymentCreated = SubjectEnum.PaymentCreated;
    queueGroupName = queueGroupName;
    
    async onMessage(data: { id: string; orderId: string; stripeId: string; }, msg: Message) {
        
        const order = Order.findById(data.orderId);
        if (!order) throw new Error('no order');

        order.set({
            status: OrderStatus.Complete
        })

        msg.ack();
    }
}