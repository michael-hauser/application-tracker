import express from 'express';
import { IUser } from '../models/User';
import { loginUser, registerUser } from '../controllers/userController';
import auth, { CustomRequest } from '../middleware/auth';

const router = express.Router();

/**
 * Register a new user.
 * @route POST /api/register
 * @param req - Express request object.
 * @param res - Express response object.
 */
router.post('/register', async (req, res) => {
  const userData: Partial<IUser> = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  const registeredUser = await registerUser(userData);
  if (registeredUser.error) {
    return res.status(400).json({
      error: registeredUser.error,
    });
  }
  return res.status(201).json(registeredUser);
});

/**
 * Authenticate and login a user.
 * @route POST /api/login
 * @param req - Express request object.
 * @param res - Express response object.
 */
router.post('/login', async (req, res) => {
  const userData: Partial<IUser> = {
    email: req.body.email,
    password: req.body.password,
  };
  const loggedInUser = await loginUser(userData);
  if (loggedInUser?.error) {
    return res.status(400).json({
      error: loggedInUser.error,
    });
  }
  return res.status(200).json(loggedInUser);
});

/**
 * Fetch logged-in user details.
 * @route GET /api/me
 * @param req - Express request object with CustomRequest interface.
 * @param res - Express response object.
 */
router.get('/me', auth, async (req: CustomRequest, res) => {
  return res.status(200).json({
    user: req.user,
  });
});

/**
 * Logout the current user.
 * @route POST /api/logout
 * @param req - Express request object with CustomRequest interface.
 * @param res - Express response object.
 */
router.post('/logout', auth, async (req: CustomRequest, res) => {
  if (req.user) {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
  }

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
router.post('/logoutall', auth, async (req: CustomRequest, res) => {
  if (req.user) {
    req.user.tokens = [];
    await req.user.save();
  }
  return res.status(200).json({
    message: 'User logged out from all devices successfully.',
  });
});

export default router;
