import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../../modelNosql/user';
import { UserTypes } from '../../../dataTypes/typings';
// import User from '../../../modelSql/user';

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

interface RegisterResponse {
    message?: string;
    user?: any;
    token?: string;
    success?: boolean;
}

type Secret = any;

export default async function register(req: NextApiRequest, res: NextApiResponse<RegisterResponse>) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }

    if (req.body.post === 1324) {
        try {
            const { name, email, password } = req.body as RegisterInput;
            // Check if user already exists in the database
            // Sequelize DB
            // const existingUser = await User.findOne({ where: { email } });
            console.log(email)
            // Mongo DB
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                res.json({ success: false, message: 'User with that email already exists' });
                return;
            }

            // Hash the password with bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user in the database
            const newUser: UserTypes = await User.create({
                name,
                email,
                password: hashedPassword,
            });

            // Return the user data and token
            res.status(201).json({ success: true, message: 'User registration successful' });
        } catch (error) {
            console.error(error);
            res.status(200).json({ success: false, message: 'Internal server error' });
        }
    } else {
        res.status(500).json({ success: false, message: 'Invalid Post Code' });
    }
}