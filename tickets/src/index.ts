import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-Wrapper';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined in env');
    }
    
    try {
        await natsWrapper.connect('ticketing', 'asd', 'http://nats-srv:4222');

        natsWrapper.client.on('close', () => {
            console.log("NATS closed");
            process.exit();
        })

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

        await mongoose.connect('mongodb://tickets-mongo-srv:27017/tickets');
        console.log("Connected to MONGO DB: TICKETS");
    } catch (err) {
        console.log(err);
    }

    app.listen(3000 , () => {
        console.log("listening on port 3000 : TICKETS");
    })
};

start();

