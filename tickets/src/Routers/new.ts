import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@sk_tickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-Wrapper";

const router = express.Router();

router.post('/api/tickets', requireAuth,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('provide E-mail'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price should be greater than 0'),
    ], validateRequest, async (req: Request, res: Response) => {

        const { title, price } = req.body;
        
        const ticket = Ticket.build({
            title, price, userId: req.currentUser!.id 
        }); 
        await ticket.save();
        
        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        })
        
        return res.status(201).send({ ticket });
});

export { router as createTicket };