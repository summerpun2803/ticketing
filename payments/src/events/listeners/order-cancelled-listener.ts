import { ListenerAbstract, OrderCancelledEvent, OrderStatus, SubjectEnum } from "@sk_tickets/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelledListener extends ListenerAbstract<OrderCancelledEvent>{
    subject: SubjectEnum.OrderCancelled = SubjectEnum.OrderCancelled;
    queueGroupName = queueGroupName;
    
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        console.log(data);
        try {
            const order = await Order.findOne({
                _id: data.id,
                version: data.version - 1,
            });
            console.log(order);
              if (!order) {
                throw new Error('Order not found');
              }
          
              order.set({ status: OrderStatus.Cancelled });
          
              await order.save();
          
              msg.ack();
        } catch (error) {
            console.error('Error processing order cancelled event:', error);
            
        }
    }
}