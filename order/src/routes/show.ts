import { NotAuthorizedError, NotFoundError, requireAuth } from "@sk_tickets/common";
import express, { NextFunction, Request, Response } from "express";

import { Order } from "../models/order";

const router = express.Router();

router.get('/api/order/:orderId', requireAuth,async (req: Request, res: Response , next:NextFunction) => {
    try {
        console.log('herre');
        const order = await Order.findById(req.params.orderId).populate('ticket');

        if (!order) {
            throw new NotFoundError();
        }
        console.log(order);
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError()
        }

        res.send(order);

    } catch (error) {
        console.log(error);
        next(error);
    }
})

export { router as showOrderRouter };
