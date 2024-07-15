import mockingoose from 'mockingoose';
import request from 'supertest';
import express, { NextFunction } from 'express';
import authRoutes from './authRoutes';
import { loginUser, registerUser, readUser} from '../controllers/userController';
import { IUser } from '../models/User';
import auth, { getTokenFromRequest } from '../middleware/auth';
import { get } from 'http';

const app = express();
app.use(express.json());

// Mocking middleware for auth
const mockAuthMiddleware = (req: any, res: any, next: any) => {
  (req as any).user = { id: 'mockUserId' }; // Mocking user id for authentication
  next();
};

// Applying mock middleware
app.use(mockAuthMiddleware);
app.use(authRoutes);

// Mock controllers
jest.mock('../controllers/userController', () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
  readUser: jest.fn()
}));

// Mock the auth middleware directly
jest.mock('../middleware/auth', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((req: any, res: any, next: NextFunction) => {
    req.user = {
      _id: 'mockUserId',
      tokens: [{ token: 'mockToken' }],
      save: jest.fn(),
    } as Partial<IUser>; // Simulate setting user in request
    req.token = 'mockToken'; // Simulate setting token in request
    next(); // Call next to simulate middleware chain
  }),
  getTokenFromRequest: (req: any) => {
    return req.header('Authorization')?.replace('Bearer ', '');
  },
}));

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

      // const mockUserProfile = {
      //   id: 'mockUserId',
      //   name: 'John Doe',
      //   email: 'john.doe@example.com',
      // };

      // // Mock readUser function to return user profile
      // (readUser as jest.Mock).mockResolvedValue(mockUserProfile);

      // Make a request using supertest
      const res = await request(app).post('/register').send(mockUserData);

      // Assert the response
      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockUserData);
    });

    it('should handle errors when registering a user', async () => {
      // Mock registerUser to throw an error
      (registerUser as jest.Mock).mockResolvedValue({
        error: 'Super error',
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

    it('should not allow registration if Authorization header is present', async () => {
      const mockUserData: Partial<IUser> = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      // Make a request using supertest with Authorization header
      const res = await request(app)
        .post('/register')
        .set('Authorization', 'Bearer mockToken')
        .send(mockUserData);

      // Assert the response
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'User can only register once' });
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
      const res = await request(app).post('/login').send(mockLoginData);

      // Assert the response
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockLoginData);
    });

    it('should handle errors when logging in', async () => {
      // Mock loginUser to throw an error
      (loginUser as jest.Mock).mockResolvedValue({
        error: 'Super error',
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

    it('should not allow login if Authorization header is present', async () => {
      const mockLoginData: Partial<IUser> = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      // Make a request using supertest with Authorization header
      const res = await request(app)
        .post('/login')
        .set('Authorization', 'Bearer mockToken')
        .send(mockLoginData);

      // Assert the response
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'User can only log in once' });
    });
  });

  describe('POST /logout', () => {
    it('should log out the current user', async () => {
      // Mocking user save method
      const mockSave = jest.fn();

      // Mocking the auth middleware to add user and token to request
      (auth as jest.Mock).mockImplementation((req: any, res: any, next: NextFunction) => {
        req.user = {
          _id: 'mockUserId',
          tokens: [{ token: 'mockToken' }],
          save: mockSave,
        } as Partial<IUser>;
        req.token = 'mockToken';
        next();
      });

      // Make a request using supertest
      const res = await request(app).post('/logout');

      // Assert the response
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'User logged out successfully.' });
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('POST /logoutall', () => {
    it('should log out the user from all devices', async () => {
      // Mocking user save method
      const mockSave = jest.fn();

      // Mocking the auth middleware to add user and token to request
      (auth as jest.Mock).mockImplementation((req: any, res: any, next: NextFunction) => {
        req.user = {
          _id: 'mockUserId',
          tokens: [{ token: 'mockToken' }],
          save: mockSave,
        } as Partial<IUser>;
        req.token = 'mockToken';
        next();
      });

      // Make a request using supertest
      const res = await request(app).post('/logoutall');

      // Assert the response
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'User logged out from all devices successfully.' });
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('GET /profile', () => {
    it('should fetch the details of the authenticated user', async () => {
      const mockUserProfile = {
        id: 'mockUserId',
        name: 'John Doe',
        email: 'john.doe@example.com',
      };

      // Mock readUser function to return user profile
      (readUser as jest.Mock).mockResolvedValue(mockUserProfile);

      // Make a request using supertest
      const res = await request(app).get('/profile');

      // Assert the response
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUserProfile);
    });

    it('should return 404 if user not found', async () => {
      // Mock readUser function to return null (user not found)
      (readUser as jest.Mock).mockResolvedValue(null);

      // Make a request using supertest
      const res = await request(app).get('/profile');

      // Assert the response
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'User not found' });
    });

    it('should return 500 if there is an internal server error', async () => {
      // Mock readUser function to throw an error
      (readUser as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

      // Make a request using supertest
      const res = await request(app).get('/profile');

      // Assert the response
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Internal Server Error' });
    });
  });
});
