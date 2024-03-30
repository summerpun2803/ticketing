import express, { NextFunction, Request, Response } from 'express'
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError ,validateRequest } from '@sk_tickets/common';

import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('provide password')
], 
    validateRequest,
    async (req: Request, res: Response , next:NextFunction) => {

        try {
    
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                throw new BadRequestError('invalid credentials');
            }

            const match = await Password.compare(
                user.password,
                password
            )
            if (!match) {
                throw new BadRequestError('invalid credentials');
            }

            const userJwt = jwt.sign({
                id: user.id,
                email: user.email
            },
                process.env.JWT_KEY!
            );
        
            req.session = {
                jwt: userJwt
            };
            console.log(req.session)
            res.status(200).send(user);
        } catch (err) {
            next(err);
        }

});

export {router as signinRouter};