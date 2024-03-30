import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler } from '@sk_tickets/common';
import { createChargeRouter } from './routes/new';


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

app.use(createChargeRouter);

app.use(errorHandler);

export { app };