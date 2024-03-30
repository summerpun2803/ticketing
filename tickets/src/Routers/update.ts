import express, { NextFunction } from "express";
import { Request, Response } from "express";
import { Ticket } from "../models/tickets";
import { NotAuthorizedError, requireAuth, validateRequest,NotFoundError, BadRequestError } from "@sk_tickets/common";
import { body } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-Wrapper";

const router = express.Router();

router.put(
    '/api/tickets/:id',
    requireAuth,
    body('title')
        .not()
        .isEmpty()
        .withMessage('title must be provided'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('price must be greater than 0'),
    validateRequest,

    async (req: Request, res: Response , next:NextFunction) => {
        try{
            const ticket = await Ticket.findById(req.params.id);

            if (!ticket) {
                throw new NotFoundError();
            };
            
            if (req.currentUser!.id != ticket.userId) {
                throw new NotAuthorizedError();
            }

            if (ticket.orderId) throw new BadRequestError('ticket is reserved');

            ticket.set({
                title: req.body.title,
                price: req.body.price
            })
            await ticket.save();

            new TicketUpdatedPublisher(natsWrapper.client).publish({
                id: ticket.id,
                title: ticket.title,
                price: ticket.price,
                userId: ticket.userId,
                version:ticket.version
            })
            
            return res.status(200).send(ticket);
            
        } catch (err) {
            next(err);
        }
});

export { router as updateTicket };