import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

interface AuthenticatedRequest extends NextApiRequest {
  user?: { email: string };
}

const secret: any = process.env.JWT_SECRET;

export const withAuth = (handler: NextApiHandler) => async (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => {
  try {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({success: false, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, secret) as { email: string };

    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized token' });
    }

    // Add the decoded token to the request object for future use
    // req.user = decoded;

    return handler(req, res);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized token' });
  }
};