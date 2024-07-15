import jwt from 'jsonwebtoken';
const mockingoose = require("mockingoose");
import { Request, Response, NextFunction } from 'express';
import supertest from 'supertest';
import auth, { AuthRequest, getTokenFromRequest } from './auth';
import User, { IUser } from '../models/User';

// Mock User model methods
mockingoose(User);
jest.mock('jsonwebtoken');

// Define a mocked user data
const mockUser: Partial<IUser> = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test',
    admin: false,
    tokens: []
  };

describe('auth middleware', () => {
  let req: Partial<AuthRequest>;
  let res: any; // Mocked Response object
  let next: NextFunction;

  beforeEach(() => {
    req = {
      header: jest.fn().mockReturnValue('Bearer validToken'),
    } as Partial<AuthRequest>;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('test', () => {
    expect(true).toBeTruthy();
  });

  it('should authenticate user when token is valid', async () => {
    // Mock User.findOne() to return the mockUser
    mockingoose(User).toReturn(mockUser, "findOne");

    // Mock jwt.verify() to return the decoded token
    (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUser._id });

    await auth(req as any, res as any, next);

    expect(req.user).toMatchObject({
      _id: expect.any(Object),
      admin: mockUser.admin,
      email: mockUser.email,
      name: mockUser.name
    });
    expect(req.token).toBe('validToken');
    expect(next).toHaveBeenCalled();
  });

  it('should send 401 error when token is missing', async () => {
    req.header = jest.fn().mockReturnValue(undefined);

    await auth(req as AuthRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: 'Authentication failed.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should send 401 error when token is invalid', async () => {
    req.header = jest.fn().mockReturnValue('Bearer invalidToken');

    // Mock jwt.verify() to throw an error
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await auth(req as AuthRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: 'Authentication failed.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should send 401 error when user is not found', async () => {
    // Mock User.findOne() to return null (user not found)
    mockingoose(User).toReturn(null, "findOne");

    // Mock jwt.verify() to return the decoded token
    (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUser._id });

    await auth(req as AuthRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: 'Authentication failed.' });
    expect(next).not.toHaveBeenCalled();
  });

  describe('getTokenFromRequest', () => {
    it('should return the token when the Authorization header is valid', () => {
      const req: Partial<AuthRequest> = {
        header: jest.fn().mockReturnValue('Bearer validToken'),
      };
  
      const token = getTokenFromRequest(req as AuthRequest);
      expect(token).toBe('validToken');
    });
  
    it('should return undefined when the Authorization header is missing', () => {
      const req: Partial<AuthRequest> = {
        header: jest.fn().mockReturnValue(undefined),
      };
  
      const token = getTokenFromRequest(req as AuthRequest);
      expect(token).toBeUndefined();
    });
  
    it('should return undefined when the Authorization header does not start with Bearer', () => {
      const req: Partial<AuthRequest> = {
        header: jest.fn().mockReturnValue('InvalidHeaderFormat'),
      };
  
      const token = getTokenFromRequest(req as AuthRequest);
      expect(token).toBeUndefined();
    });
  
    it('should return undefined when the Authorization header is Bearer but no token', () => {
      const req: Partial<AuthRequest> = {
        header: jest.fn().mockReturnValue('Bearer '),
      };
  
      const token = getTokenFromRequest(req as AuthRequest);
      expect(token).toBeUndefined();
    });
  });
});
