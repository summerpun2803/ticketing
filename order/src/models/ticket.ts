import mongoose from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@sk_tickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
    id: String,
    price: number,
    title: string
}

export interface TicketDocs extends mongoose.Document{
    price: number
    title: string
    version:number
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocs>{
    build(attrs: TicketAttrs) : TicketDocs
}

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min:0
    },

} , {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

TicketSchema.set('versionKey', 'version');
TicketSchema.plugin(updateIfCurrentPlugin);

TicketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
}
TicketSchema.methods.isReserved = async function () {
    
    const exsistingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });

    return !!exsistingOrder;
}

const Ticket = mongoose.model<TicketDocs , TicketModel>('Ticket', TicketSchema);

export { Ticket };