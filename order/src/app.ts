import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler } from '@sk_tickets/common';
import { newOrderRouter } from './routes/new';
import { indexOrderRouter } from './routes';
import { showOrderRouter } from './routes/show';
import { deleteOrder } from './routes/delete';



const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);

app.use((req, res,next) => {
    console.log(req.path , req.method);
    next();
})
app.use(currentUser);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrder);

app.use(errorHandler);

export { app };