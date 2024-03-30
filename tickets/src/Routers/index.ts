import express from "express";
import { Request, Response } from "express";
import { Ticket } from "../models/tickets";

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({orderId: undefined});
    return res.status(200).send({ tickets });
});

export { router as getAllTickets };