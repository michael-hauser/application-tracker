import express from 'express';
import authRoutes from './authRoutes';
import applicationRoutes from './applicationRoutes';
import stageRoutes from './stageRoutes';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/applications', applicationRoutes);
router.use('/stages', stageRoutes);

export default router;
