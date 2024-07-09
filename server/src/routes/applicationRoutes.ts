import express, { Request, Response } from 'express';
import { getAllApplications, getApplicationById, createApplication, updateApplication, deleteApplication } from '../controllers/applicationController';

const router = express.Router();

/**
 * @route GET /applications
 * @description Get all applications for the current user
 * @access Private
 */
router.get('/', async (req: Request, res: Response) => {
    const userId = req.user?.id; // Assuming userId is extracted from authentication middleware
    try {
        const applications = await getAllApplications(userId);
        res.json(applications);
    } catch (err: any) {
        console.error('Error fetching applications:', err.message);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

/**
 * @route GET /applications/:id
 * @description Get a single application by ID
 * @access Private
 */
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id; // Assuming userId is extracted from authentication middleware
    try {
        const application = await getApplicationById(id, userId);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(application);
    } catch (err: any) {
        console.error('Error fetching application:', err.message);
        res.status(500).json({ error: 'Failed to fetch application' });
    }
});

/**
 * @route POST /applications
 * @description Create a new application
 * @access Private
 */
router.post('/', async (req: Request, res: Response) => {
    const applicationData = req.body;
    const userId = req.user?.id; // Assuming userId is extracted from authentication middleware
    try {
        const newApplication = await createApplication({ ...applicationData, user: userId });
        res.status(201).json(newApplication);
    } catch (err: any) {
        console.error('Error creating application:', err.message);
        res.status(500).json({ error: 'Failed to create application' });
    }
});

/**
 * @route PUT /applications/:id
 * @description Update an existing application by ID
 * @access Private
 */
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const applicationData = req.body;
    const userId = req.user?.id; // Assuming userId is extracted from authentication middleware
    try {
        const updatedApplication = await updateApplication(id, applicationData, userId);
        if (!updatedApplication) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(updatedApplication);
    } catch (err: any) {
        console.error('Error updating application:', err.message);
        res.status(500).json({ error: 'Failed to update application' });
    }
});

/**
 * @route DELETE /applications/:id
 * @description Delete an application by ID
 * @access Private
 */
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id; // Assuming userId is extracted from authentication middleware
    try {
        const message = await deleteApplication(id, userId);
        res.json({ message });
    } catch (err: any) {
        console.error('Error deleting application:', err.message);
        res.status(500).json({ error: 'Failed to delete application' });
    }
});

export default router;
