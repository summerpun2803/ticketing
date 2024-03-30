import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-Wrapper';

const start = async () => {
    
    try {
        await natsWrapper.connect('ticketing', 'Zxcvb', 'http://nats-srv:4222');

        natsWrapper.client.on('close', () => {
            console.log("NATS closed");
            process.exit();
        })

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
    } catch (err) {
        console.log(err);
    }
};

start();

