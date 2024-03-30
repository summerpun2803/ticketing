import express, { NextFunction } from "express"
import { Request , Response } from "express";
import { Ticket } from "../models/tickets";
import {  NotFoundError } from "@sk_tickets/common";

const router = express.Router();

router.get('/api/tickets/:id', async (req : Request , res:Response ,next:NextFunction) => {
    const ticketId = req.params.id;
    
   try{ 
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            throw new NotFoundError();
        }

       return res.status(200).send(ticket);
   } catch (err) {
       next(err);
   }
      
})

export { router as showTicket };