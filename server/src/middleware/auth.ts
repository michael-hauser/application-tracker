import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

/**
 * Extended Request interface with optional user and token properties.
 */
export interface AuthRequest extends Request {
  user?: IUser;
  token?: string;
}

/**
 * Decoded JWT token interface.
 */
interface DecodedToken {
  id: string;
}

/**
 * Extracts the token from the Authorization header.
 * @param req - Express request object with CustomRequest interface.
 * @returns The token if present and correctly formatted, otherwise undefined.
 */
export const getTokenFromRequest = (req: AuthRequest) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return undefined;
  }
  const token = authHeader.replace('Bearer ', '');
  return token || undefined;
};

/**
 * Middleware function to authenticate requests using JWT.
 * @param req - Express request object with CustomRequest interface.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      throw new Error('Authentication failed. Token missing.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    const user = await User.findOne({
      _id: decoded.id,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error('Authentication failed. User not found.');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Authentication failed.' });
  }
};

export default auth;
