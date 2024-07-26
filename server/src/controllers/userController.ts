import User, { IUser } from '../models/User';
import Mailgun from 'mailgun-js';
import crypto from 'crypto';

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

/**
 * Sends a password reset email.
 * @param email - The email address to send the password reset link to.
 * @returns A promise that resolves when the email is sent.
 */
export const sendResetPasswordEmail = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User with this email does not exist');
  }

  // Generate a password reset token
  const token = crypto.randomBytes(32).toString('hex');
  const oneHour = 3600000; // 1 hour in milliseconds
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + oneHour);
  await user.save();

  // Generate password reset link
  const resetUrl = `${process.env.CLIENT_ORIGIN}/update-password?token=${token}`;

  // Get Mailgun API credentials
  const MAILGUN_API_TOKEN = process.env.MAILGUN_API_TOKEN as string;
  const EMAIL_DOMAIN = process.env.EMAIL_DOMAIN as string;
  const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS as string;

  // Initialize Mailgun client
  const mailgun = new Mailgun({ apiKey: MAILGUN_API_TOKEN, domain: EMAIL_DOMAIN });

  // Compose Email
  const data = {
    from: EMAIL_ADDRESS,
    to: email,
    subject: 'Application Tracker Password Reset',
    html: `<p>You requested a password reset for Application Tracker. Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>`
  };

  // Send email
  try {
    await mailgun.messages().send(data);
  } catch (error: any) {
    console.error('Error sending password reset email:', error.message);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Hashes and updates the user's password based on the provided token and new password.
 * @param token - The password reset token.
 * @param newPassword - The new password to hash and set.
 * @returns A result object containing success or error information.
 */
export const updateUserPassword = async (token: string, newPassword: string) => {
  try {
    // Find user by reset token and check if it is still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return { status: 400, error: 'Password reset token is invalid or has expired' };
    }

    // Hash new password and update user record
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { status: 200, message: 'Password updated successfully' };
  } catch (error: any) {
    console.error('Error updating password:', error.message);
    return { status: 500, error: 'Failed to update password' };
  }
};