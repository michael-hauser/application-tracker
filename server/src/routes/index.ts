import express from 'express';
import authRoutes from './authRoutes';
import applicationRoutes from './applicationRoutes';
import stageRoutes from './stageRoutes';
import auth from '../middleware/auth';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/applications', auth, applicationRoutes);
router.use('/stages', auth, stageRoutes);

export default router;
