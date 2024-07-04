const mockingoose = require("mockingoose");
import request from 'supertest';
import express, { NextFunction } from 'express';
import authRoutes from './authRoutes';
import { loginUser, registerUser } from '../controllers/userController';
import { IUser } from '../models/User';
import auth, { CustomRequest } from '../middleware/auth';

const app = express();
app.use(express.json());

// Mocking middleware for auth
const mockAuthMiddleware = (req: any, res: any, next: any) => {
    (<any>req).user = { id: 'mockUserId' }; // Mocking user id for authentication
    next();
};

// Applying mock middleware
app.use(mockAuthMiddleware);
app.use(authRoutes);

// Mock controllers
jest.mock('../controllers/userController', () => ({
    loginUser: jest.fn(),
    registerUser: jest.fn(),
}));

// Mock the auth middleware directly
jest.mock('../middleware/auth', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation((req: any, res: any, next: NextFunction) => {
        req.user = <Partial<IUser>>{
            _id: 'mockUserId',
            tokens: [{token: 'mockToken'}],
            save: jest.fn(),
        }; // Simulate setting user in request
        req.token = 'mockToken'; // Simulate setting token in request
        next(); // Call next to simulate middleware chain
    }),
}));
// jest.mock('../middleware/auth', () => ({
//     auth: (req: any, res: any, next: any) => {
//         (<any>req).user = { id: 'mockUserId' }; // Mocking user id for authentication
//         next();
//     },
// }))

describe('authRoutes', () => {
    describe('POST /register', () => {
        it('should register a new user', async () => {
            const mockUserData: Partial<IUser> = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            };

            // Mock registerUser function to return registered user data
            (registerUser as jest.Mock).mockResolvedValue(mockUserData);

            // Make a request using supertest
            const res = await request(app)
                .post('/register')
                .send(mockUserData);

            // Assert the response
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockUserData);
        });

        it('should handle errors when registering a user', async () => {
            // Mock registerUser to throw an error
            (registerUser as jest.Mock).mockResolvedValue({
                error: 'Super error'
            });

            // Make a request using supertest
            const res = await request(app)
                .post('/register')
                .send({
                    name: 'Jane Doe',
                    email: 'jane.doe@example.com',
                    password: 'password456',
                });

            // Assert the response
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Super error' });
        });
    });

    describe('POST /login', () => {
        it('should log in a user', async () => {
            const mockLoginData: Partial<IUser> = {
                email: 'john.doe@example.com',
                password: 'password123',
            };

            // Mock loginUser function to return logged-in user data
            (loginUser as jest.Mock).mockResolvedValue(mockLoginData);

            // Make a request using supertest
            const res = await request(app)
                .post('/login')
                .send(mockLoginData);

            // Assert the response
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockLoginData);
        });

        it('should handle errors when logging in', async () => {
            // Mock loginUser to throw an error
            (loginUser as jest.Mock).mockResolvedValue({
                error: 'Super error'
            });

            // Make a request using supertest
            const res = await request(app)
                .post('/login')
                .send({
                    email: 'jane.doe@example.com',
                    password: 'password456',
                });

            // Assert the response
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Super error' });
        });
    });

    describe('POST /logout', () => {
        it('should log out the current user', async () => {
            // Mock user object with token
            const mockUser = {
                id: 'mockUserId',
                tokens: [{ token: 'mockToken' }],
                save: jest.fn(),
            };

            // Auth middleware will mock user
            // Make a request using supertest
            const res = await request(app)
                .post('/logout')
                .set('Authorization', `Bearer ${mockUser.tokens[0].token}`);

            // Assert the response
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'User logged out successfully.' });
        });
    });

    describe('POST /logoutall', () => {
        it('should log out the user from all devices', async () => {
            // Mock user object with tokens
            const mockUser = {
                id: 'mockUserId',
                tokens: [{ token: 'mockToken1' }, { token: 'mockToken2' }],
                save: jest.fn(),
            };

            // Auth middleware will mock user
            // Make a request using supertest
            const res = await request(app)
                .post('/logoutall')
                .set('Authorization', `Bearer ${mockUser.tokens[0].token}`);

            // Assert the response
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'User logged out from all devices successfully.' });
        });
    });
});
