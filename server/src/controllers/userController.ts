import User, { IUser } from '../models/User';

/**
 * Checks if the password meets the standard requirements.
 * @param password - The password to be validated.
 * @returns A boolean indicating whether the password is valid or not.
 */
const isPasswordValid = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>-]/.test(password);

  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

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

  if (!isPasswordValid(password)) {
    return {
      error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
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
    return {
      error: 'Login failed',
    };
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
