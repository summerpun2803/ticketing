import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined in env');
    }
    
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
        console.log("Connected to MONGO DB")
    } catch (err) {
        console.log(err);
    }

    app.listen(3000 , () => {
        console.log("listening on port 3000 : AUTH");
    })
};

start();

