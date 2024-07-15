import express, { Request } from 'express';
import { IUser } from '../models/User';
import { loginUser, readUser, registerUser } from '../controllers/userController';
import auth, { CustomRequest, getTokenFromRequest } from '../middleware/auth';
import { addCsrfToken, csrfErrorHandler, doubleCsrfProtection, removeCsrfToken } from '../middleware/csrf';

const router = express.Router();

/**
 * Register a new user.
 * @route POST /api/register
 * @param req - Express request object.
 * @param res - Express response object.
 */
router.post('/register', async (req: Request, res: any) => {
  const token = getTokenFromRequest(req);

  if (token) {
    return res.status(400).json({
      error: 'User can only register once',
    });
  }

  const userData: Partial<IUser> = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const user = await registerUser(userData);

  if (user.error) {
    return res.status(400).json({
      error: user.error,
    });
  }

  try {
    const csrfToken = addCsrfToken(req, res, user.token);
    return res.status(201).json({ ...user, csrfToken });
  } catch (error: any) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * Authenticate and login a user.
 * @route POST /api/login
 * @param req - Express request object.
 * @param res - Express response object.
 */
router.post('/login', async (req: Request, res: any) => {
  const token = getTokenFromRequest(req);

  if (token) {
    return res.status(400).json({
      error: 'User can only log in once',
    });
  }

  const userData: Partial<IUser> = {
    email: req.body.email,
    password: req.body.password,
  };

  const user = await loginUser(userData);

  if (!user || user.error) {
    return res.status(400).json({
      error: user.error,
    });
  }

  try {
    const csrfToken = addCsrfToken(req, res, user.token);
    return res.status(200).json({ ...user, csrfToken });
  } catch (error: any) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * Logout the current user.
 * @route POST /api/logout
 * @param req - Express request object with CustomRequest interface.
 * @param res - Express response object.
 */
router.post('/logout', auth, doubleCsrfProtection, csrfErrorHandler, async (req: CustomRequest, res: any) => {
  if (req.user) {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
  }

  removeCsrfToken(req, res);

  return res.status(200).json({
    message: 'User logged out successfully.',
  });
});

/**
 * Logout the user from all devices.
 * @route POST /api/logoutall
 * @param req - Express request object with CustomRequest interface.
 * @param res - Express response object.
 */
router.post('/logoutall', auth, doubleCsrfProtection, csrfErrorHandler, async (req: CustomRequest, res: any) => {
  if (req.user) {
    req.user.tokens = [];
    await req.user.save();
  }
  
  removeCsrfToken(req, res);

  return res.status(200).json({
    message: 'User logged out from all devices successfully.',
  });
});

/**
 * Fetch details of the authenticated user.
 * @route GET /api/profile
 * @param req - Express request object with CustomRequest interface.
 * @param res - Express response object.
 */
router.get('/profile', auth, doubleCsrfProtection, csrfErrorHandler, async (req: CustomRequest, res: any) => {
  try {
    const user = await readUser(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error: any) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;

