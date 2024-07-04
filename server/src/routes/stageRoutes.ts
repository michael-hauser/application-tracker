import express, { Request, Response } from 'express';
import {
  getAllStages,
} from '../controllers/stageController';

const router = express.Router();

// GET /stages - Get all stages
router.get('/', async (req: Request, res: Response) => {
  try {
    const stages = await getAllStages();
    res.status(200).json(stages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stages' });
  }
});

export default router;
