import User, { IUser } from '../models/User';

/**
 * Registers a new user.
 * @param user - Partial user object containing name, email, and password.
 * @returns A promise that resolves with the registered user and authentication token, or an error object.
 */
export const registerUser = async (user: Partial<IUser>) => {
  const { name, email, password } = user;
  if (!name || !email || !password) {
    return {
      error: 'Please provide all the required fields',
    };
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return {
      error: 'User with that email already exists.',
    };
  }
  const newUser = new User({ name, email, password });
  await newUser.save();
  const token = await newUser.generateAuthToken();
  return {
    user: newUser,
    token,
  };
};

/**
 * Logs in an existing user.
 * @param user - Partial user object containing email and password.
 * @returns A promise that resolves with the logged-in user and authentication token, or null if login fails.
 */
export const loginUser = async (user: Partial<IUser>) => {
  const { email, password } = user;
  
  if (!email || !password) {
    return {
      error: 'Please provide all the required fields',
    };
  }
  const existingUser = await User.findByCredentials(email, password);
  if (!existingUser) {
    return null;
  }
  const token = await existingUser.generateAuthToken();
  return {
    user: existingUser,
    token,
  };
};

/**
 * Fetch user details for the authenticated user.
 * @param userId - ID of the authenticated user.
 * @returns Promise resolving to user object.
 */
export const readUser = async (userId: string): Promise<IUser | null> => {
  try {
    const user = await User.findById(userId).select('-password');
    return user;
  } catch (error: any) {
    console.error('Error fetching user:', error.message);
    throw new Error('Failed to fetch user');
  }
};
