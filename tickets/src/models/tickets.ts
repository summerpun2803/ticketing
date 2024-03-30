import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
    userId: string
    price: number
    title: string
}

interface TicketDocs extends mongoose.Document{
    userId: string
    price: number
    title: string
    version: number
    orderId?: string
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
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type:String,
    }

} , {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
TicketSchema.set('versionKey', 'version');
TicketSchema.plugin(updateIfCurrentPlugin);

TicketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}


const Ticket = mongoose.model<TicketDocs , TicketModel>('Ticket', TicketSchema);

export { Ticket };