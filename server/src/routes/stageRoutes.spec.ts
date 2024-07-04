import request from 'supertest';
import express, { Express } from 'express';
import stageRoutes from './stageRoutes';
import { getAllStages } from '../controllers/stageController';
import { describe } from 'node:test';


const app: Express = express();
app.use(express.json());
app.use('/stages', stageRoutes);

jest.mock('../controllers/stageController', () => ({
    getAllStages: jest.fn(),
}));

describe('stageRoutes', () => {
    describe('GET /stages', () => {
        it('should return all stages', async () => {
            // Mock data for getAllStages
            const mockStages = [
                { _id: '1', name: 'Stage 1', number: 1 },
                { _id: '2', name: 'Stage 2', number: 2 },
            ];
    
            // Mock getAllStages to return mockStages
            (getAllStages as jest.Mock).mockResolvedValue(mockStages);
    
            // Make request to /stages endpoint
            const response = await request(app).get('/stages');
    
            // Assert response
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockStages);
        });
    
        it('should handle errors and return 500 status', async () => {
            // Mock getAllStages to throw an error
            (getAllStages as jest.Mock).mockRejectedValue(new Error('Failed to fetch stages'));
    
            // Make request to /stages endpoint
            const response = await request(app).get('/stages');
    
            // Assert response
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to fetch stages' });
        });
    });
});