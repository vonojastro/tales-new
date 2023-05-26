import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import cookie from 'cookie';
import { withAuth } from '../authMiddleware/auth';
import jwt from 'jsonwebtoken';
import User from '../../../modelSql/user'

interface LoginRequestBody {
  email: string;
  password: string;
}

const secret: any = process.env.JWT_SECRET;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password }: LoginRequestBody = req.body;
  console.log(email, password)

 // Validate email and password
 if (!email || !password) {
  return res.status(400).json({ message: 'Email and password are required' });
}
  // Query the database to find the user with the provided email
  const user : any = await User.findOne({ where: { email } });

  // Check if the password is correct
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({success: false, message: 'Unauthorized' });
  }

  // Create a JWT token
  const token = jwt.sign({ email: user.email }, secret);

  // Set the token in a cookie
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    })
  );

  return res.status(200).json({success: true, message: 'Logged in successfully' });
};

export default withAuth(handler);