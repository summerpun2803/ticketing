import express, {NextFunction, Request , Response} from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken';
import { BadRequestError ,validateRequest } from '@sk_tickets/common';

import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signup' ,[
    body('email')
        .isEmail()
        .withMessage('Email must be provided'),
    body('password')
        .trim()
        .isLength({ min:4 , max:20 })
        .withMessage('Password must be provided')
],
    validateRequest,
    async (req: Request, res: Response ,next:NextFunction) => {

        try {

            const { email, password } = req.body;
        
            const exsistingUser = await User.findOne({ email });
            if (exsistingUser) {
                throw new BadRequestError('Email Alredy in Use');
            }

            const user = User.build({ email, password });
            await user.save();

            const userJwt = jwt.sign({
                id: user.id,
                email: user.email
            },
                process.env.JWT_KEY!
            );

            req.session = {
                jwt: userJwt
            };

            res.status(201).send(user);
        } catch (error) {
            console.log(error);
            next(error);
        }
        
});

export {router as signupRouter};