import request from 'supertest';
import express, { Request, Response } from 'express';
import applicationRoutes from './applicationRoutes';
import { getAllApplications, getApplicationById, createApplication, updateApplication, deleteApplication } from '../controllers/applicationController';
import { describe } from 'node:test';

const app = express();
app.use(express.json());

// Mocking middleware for authentication
const mockAuthMiddleware = (req: Request, res: Response, next: Function) => {
    (<any>req).user = { id: 'mockUserId' }; // Mocking user id for authentication
    next();
};

// Applying mock middleware to all routes
app.use(mockAuthMiddleware);
app.use(applicationRoutes);

// Mock controllers
jest.mock('../controllers/applicationController', () => ({
    getAllApplications: jest.fn(),
    getApplicationById: jest.fn(),
    createApplication: jest.fn(),
    updateApplication: jest.fn(),
    deleteApplication: jest.fn(),
}));

describe('applicationRoutes', () => {
    describe('GET /applications', () => {
        it('should return all applications for the user', async () => {
            const mockApplications = [
                { _id: '1', company: 'Company A', role: 'Role A' },
                { _id: '2', company: 'Company B', role: 'Role B' },
            ];
    
            // Mock the getAllApplications function to return mockApplications
            (getAllApplications as jest.Mock).mockResolvedValue(mockApplications);
    
            // Make a request using supertest
            const res = await request(app).get('/applications');
    
            // Assert the response
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockApplications);
        });
    
        it('should handle errors when fetching applications', async () => {
            // Mock getAllApplications to throw an error
            (getAllApplications as jest.Mock).mockRejectedValue(new Error('Failed to fetch applications'));
    
            // Make a request using supertest
            const res = await request(app).get('/applications');
    
            // Assert the response
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to fetch applications' });
        });
    });
    
    describe('GET /applications/:id', () => {
        it('should get a single application by ID', async () => {
            const mockApplicationId = 'mockApplicationId';
            const mockApplication = {
                _id: mockApplicationId,
                company: 'Mock Company',
                role: 'Mock Role',
            };
    
            // Mock getApplicationById function to return mockApplication
            (getApplicationById as jest.Mock).mockResolvedValue(mockApplication);
    
            // Make a request using supertest
            const res = await request(app).get(`/applications/${mockApplicationId}`);
    
            // Assert the response
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockApplication);
        });
    
        it('should handle errors when fetching an application by ID', async () => {
            const mockApplicationId = 'mockApplicationId';
            // Mock getApplicationById to throw an error
            (getApplicationById as jest.Mock).mockRejectedValue(new Error('Failed to fetch application'));
    
            // Make a request using supertest
            const res = await request(app).get(`/applications/${mockApplicationId}`);
    
            // Assert the response
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to fetch application' });
        });
    
        it('should return 404 if application is not found', async () => {
            const mockApplicationId = 'nonExistingId';
            // Mock getApplicationById to return null (application not found)
            (getApplicationById as jest.Mock).mockResolvedValue(null);
    
            // Make a request using supertest
            const res = await request(app).get(`/applications/${mockApplicationId}`);
    
            // Assert the response
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Application not found' });
        });
    });
    
    describe('POST /applications', () => {
        it('should create a new application', async () => {
            const mockApplicationData = {
                company: 'New Company',
                role: 'New Role',
                salary: 100000,
            };
    
            // Mock createApplication function to return mockApplicationData
            (createApplication as jest.Mock).mockResolvedValue(mockApplicationData);
    
            // Make a request using supertest
            const res = await request(app)
                .post('/applications')
                .send(mockApplicationData);
    
            // Assert the response
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockApplicationData);
        });
    
        it('should handle errors when creating an application', async () => {
            // Mock createApplication to throw an error
            (createApplication as jest.Mock).mockRejectedValue(new Error('Failed to create application'));
    
            // Make a request using supertest
            const res = await request(app)
                .post('/applications')
                .send({ company: 'New Company', role: 'New Role', salary: 100000 });
    
            // Assert the response
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to create application' });
        });
    });
    
    describe('PUT /applications/:id', () => {
        it('should update an existing application', async () => {
            const mockApplicationId = 'mockApplicationId';
            const mockUpdatedData = {
                company: 'Updated Company',
                role: 'Updated Role',
                salary: 120000,
            };
    
            // Mock updateApplication function to return updated data
            (updateApplication as jest.Mock).mockResolvedValue(mockUpdatedData);
    
            // Make a request using supertest
            const res = await request(app)
                .put(`/applications/${mockApplicationId}`)
                .send(mockUpdatedData);
    
            // Assert the response
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdatedData);
        });
    
        it('should handle errors when updating an application', async () => {
            const mockApplicationId = 'mockApplicationId';
            // Mock updateApplication to throw an error
            (updateApplication as jest.Mock).mockRejectedValue(new Error('Failed to update application'));
    
            // Make a request using supertest
            const res = await request(app)
                .put(`/applications/${mockApplicationId}`)
                .send({ company: 'Updated Company', role: 'Updated Role', salary: 120000 });
    
            // Assert the response
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to update application' });
        });
    });
    
    describe('DELETE /applications/:id', () => {
        it('should delete an existing application', async () => {
            const mockApplicationId = 'mockApplicationId';
            const mockMessage = 'Application removed';
    
            // Mock deleteApplication function to return success message
            (deleteApplication as jest.Mock).mockResolvedValue(mockMessage);
    
            // Make a request using supertest
            const res = await request(app)
                .delete(`/applications/${mockApplicationId}`);
    
            // Assert the response
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: mockMessage });
        });
    
        it('should handle errors when deleting an application', async () => {
            const mockApplicationId = 'mockApplicationId';
            // Mock deleteApplication to throw an error
            (deleteApplication as jest.Mock).mockRejectedValue(new Error('Failed to delete application'));
    
            // Make a request using supertest
            const res = await request(app)
                .delete(`/applications/${mockApplicationId}`);
    
            // Assert the response
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to delete application' });
        });
    });
});