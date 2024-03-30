import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler } from '@sk_tickets/common';

import { currentUserRouter } from './routes/current-users';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

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
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(errorHandler);

export { app };