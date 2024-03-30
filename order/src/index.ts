import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-Wrapper';
import { TicketCreatedListener } from './events/listener/ticket-created-listener';
import { TicketUpdatedListener } from './events/listener/ticket-update-listener';
import { ExpirationCompleteListener } from './events/listener/expiration-complete-listeer';
import { PaymentCreatedListener } from './events/listener/payment-created-listener';

const start = async () => {

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined in env');
    }
    
    try {
        await natsWrapper.connect('ticketing', 'asdf', 'http://nats-srv:4222');

        natsWrapper.client.on('close', () => {
            console.log("NATS closed");
            process.exit();
        })

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();

        await mongoose.connect('mongodb://order-mongo-srv:27017/order');
        console.log("Connected to MONGO DB : ORDER");
    } catch (err) {
        console.log(err);
    }

    app.listen(3000 , () => {
        console.log("listening on port 3000 : ORDER");
    })
};

start();

