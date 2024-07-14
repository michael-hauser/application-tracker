import express from 'express';
import authRoutes from './authRoutes';
import applicationRoutes from './applicationRoutes';
import stageRoutes from './stageRoutes';
import auth from '../middleware/auth';
import { csrfErrorHandler, doubleCsrfProtection } from '../middleware/csrf';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/applications', auth, doubleCsrfProtection, csrfErrorHandler, applicationRoutes);
router.use('/stages', auth, doubleCsrfProtection, csrfErrorHandler, stageRoutes);

export default router;
