import { BadRequestError, NotFoundError, OrderStatus, requireAuth } from "@sk_tickets/common";
import express,{NextFunction, Request , Response} from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-Wrapper";

const EXPIRATON_SECONDS = 1* 60;

const router = express.Router();

router.post('/api/order', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Ticket must be provided'),
], async (req: Request, res: Response , next: NextFunction) => {
    try {
        
        const { ticketId } = req.body;

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) throw new NotFoundError();
        
        const isReserved = await ticket.isReserved();
        if (isReserved) throw new BadRequestError('Ticket is Reserved');

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATON_SECONDS);

        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });
        await order.save();

        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            version: order.version,
            ticket: {
                id: ticket.id,
                price: ticket.price,
            }
        });
        
        // const Orders = await Order.find({});
        // console.log(Orders);

        res.status(201).send(order);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

export { router as newOrderRouter };