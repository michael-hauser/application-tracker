/**
 * Checks if the password meets the standard requirements.
 * @param password - The password to be validated.
 * @returns A boolean indicating whether the password is valid or not.
 */
export const isPasswordValid = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>-]/.test(password);
  
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };
  