import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@sk_tickets/common";
import express,{NextFunction, Request , Response} from "express"
import { body } from "express-validator";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-Wrapper";

const router = express.Router();

router.post('/api/payments',
    requireAuth,
    [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
    validateRequest,
    async (req: Request, res: Response , next:NextFunction) => {
        try {
            const { token, orderId } = req.body;
            const order = await Order.findById(orderId);

            if (!order) throw new NotFoundError();

            if (order.userId !== req.currentUser!.id) {
                throw new NotAuthorizedError();
            }

            if (order.status === OrderStatus.Cancelled) {
                throw new BadRequestError('cannot pay for cancelled order');
            }

            const charge = await stripe.paymentIntents.create({
                currency: 'usd',
                amount: order.price * 100,
                // source: token,
            });
            
            const payment = Payment.build({
                orderId,
                stripeId: charge.id
            });

            await payment.save();

            new PaymentCreatedPublisher(natsWrapper.client).publish({
                id: payment.id,
                orderId: payment.orderId,
                stripeId: payment.stripeId
            });

            res.status(201).send({ id: payment.id });

        } catch (err) {
            console.error('Payment creation error:', err);
            next(err);
        }
        
    }
)

export { router as createChargeRouter }; 