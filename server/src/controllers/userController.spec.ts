const mockingoose = require("mockingoose");
import { loginUser, registerUser } from './userController';
import User, { IUser } from '../models/User';

// Mock User model methods
mockingoose(User);

// Define a mocked user data
const mockUserData: Partial<IUser> = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test',
  admin: false,
  tokens: []
};

describe('userController', () => {
  describe('loginUser', () => {
    beforeEach(() => {
      // Reset mockingoose after each test
      mockingoose.resetAll();
      // Mock JWT_SECRET environment variable
      process.env.JWT_SECRET = 'SUPER_SECRET';
    });

    it('should return error if email or password is missing', async () => {
      const result = await loginUser({});
      expect(result).toEqual({
        error: 'Please provide all the required fields',
      });
    });

    it('should return null if user with provided credentials does not exist', async () => {
      mockingoose(User).toReturn(null, 'findOne');
      const result = await loginUser(mockUserData);
      expect(result).toBeNull();
    });

    it('should return user and token if login is successful', async () => {
      const mockedUser = {
        ...mockUserData,
        _id: 'mockedUserId',
        generateAuthToken: jest.fn().mockResolvedValue('mockedAuthToken')
      };

      mockingoose(User).toReturn(mockedUser, 'findOne');

      // Mock the static method findByCredentials
      (User as any).findByCredentials = jest.fn().mockResolvedValue(mockedUser);

      const result = await loginUser(mockUserData);
      expect(result).toEqual({
        user: mockedUser,
        token: 'mockedAuthToken',
      });
    });
  });

  describe('registerUser', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return error if name, email, or password is missing', async () => {
      const userWithoutName = { email: 'test@example.com', password: 'password123' };
      const resultWithoutName = await registerUser(userWithoutName);
      expect(resultWithoutName).toEqual({ error: 'Please provide all the required fields' });

      const userWithoutEmail = { name: 'Test', password: 'password123' };
      const resultWithoutEmail = await registerUser(userWithoutEmail);
      expect(resultWithoutEmail).toEqual({ error: 'Please provide all the required fields' });

      const userWithoutPassword = { name: 'Test', email: 'test@example.com' };
      const resultWithoutPassword = await registerUser(userWithoutPassword);
      expect(resultWithoutPassword).toEqual({ error: 'Please provide all the required fields' });
    });

    it('should return error if user with provided email already exists', async () => {
      const existingUser = {
        _id: 'mockedUserId',
        name: 'Test',
        email: 'test@example.com',
        password: 'password123',
        tokens: []
      };

      mockingoose(User).toReturn(existingUser, 'findOne');

      const user = { name: 'Test', email: 'test@example.com', password: 'password123' };
      const result = await registerUser(user);
      expect(result).toEqual({ error: 'User with that email already exists.' });
    });

    describe('registerUser function', () => {
      beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks between tests if necessary
      });

      it('should return user and token if registration is successful', async () => {
        // Mock user data to register
        const userToRegister = { name: 'Test', email: 'newuser@example.com', password: 'password123' };

        // Mock saved user object returned from database after registration
        const savedUser = {
          _id: 'newUserId', // This will be dynamically generated by MongoDB or mockingoose
          name: 'Test',
          email: 'newuser@example.com',
          password: 'password123',
          tokens: [],
          generateAuthToken: jest.fn().mockResolvedValue('mockedAuthToken')
        };

        // Mock the User model methods with mockingoose
        mockingoose(User).toReturn(null, 'findOne');
        mockingoose(User).toReturn(savedUser, 'save');

        // Call the registerUser function
        const result = await registerUser(userToRegister);

        // Assert that the result matches the expected structure using toMatchObject
        expect(result).toMatchObject({
          user: {
            id: expect.any(String), // Ensure _id is a string (actual value doesn't matter here)
            name: 'Test',
            email: 'newuser@example.com',
            tokens: expect.any(Array),
          },
          token: expect.any(String),
        });
      });
    });
  });
});