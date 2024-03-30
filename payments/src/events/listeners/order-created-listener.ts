import { ListenerAbstract, OrderCreatedEvent, OrderStatus, SubjectEnum } from "@sk_tickets/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends ListenerAbstract<OrderCreatedEvent>{
    subject: SubjectEnum.OrderCreated = SubjectEnum.OrderCreated;
    queueGroupName = queueGroupName;
    
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        })

        await order.save();

        // const orders = await Order.find({});
        // console.log(orders);

        msg.ack();
    }
}