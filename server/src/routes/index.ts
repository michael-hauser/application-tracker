import express from 'express';
import csrfRoutes from './csrfRoutes';
import authRoutes from './authRoutes';
import applicationRoutes from './applicationRoutes';
import stageRoutes from './stageRoutes';
import auth from '../middleware/auth';
import { csrfErrorHandler, doubleCsrfProtection } from '../middleware/csrf';

const router = express.Router();

// Mount routes
router.use('/csrf', csrfRoutes);
router.use('/auth', doubleCsrfProtection, csrfErrorHandler, authRoutes);
router.use('/applications', auth, doubleCsrfProtection, csrfErrorHandler, applicationRoutes);
router.use('/stages', auth, doubleCsrfProtection, csrfErrorHandler, stageRoutes);

export default router;
