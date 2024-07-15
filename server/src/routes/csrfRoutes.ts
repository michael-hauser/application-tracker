import express from 'express';
import { generateToken } from '../middleware/csrf';

const router = express.Router();

router.get("/", (req, res) => {
    return res.status(201).json({
        token: generateToken(req, res, true),
    });
});

export default router;