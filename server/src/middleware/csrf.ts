import { doubleCsrf } from "csrf-csrf";
import { getTokenFromRequest } from "./auth";

const CSRF_COOKIE_NAME = "x-csrf-token";

const COOKIE_OPTIONS = {
  sameSite: true,
  secure: false,
};

// In production, ensure you're using cors and helmet and have proper configuration.
const { invalidCsrfTokenError, generateToken, doubleCsrfProtection } =
  doubleCsrf({
    getSecret: (req: any) => {
      const token = getAuthTokenForCsrf(req);
      return `${token}${process.env.CSRF_SECRET}`; // Tie the CSRF token to the user's session
    },
    cookieName: CSRF_COOKIE_NAME,
    cookieOptions: COOKIE_OPTIONS,
  });

// Error handling, validation error interception
const csrfErrorHandler = (error: any, req: any, res: any, next: any) => {
  if (error == invalidCsrfTokenError) {
    res.status(403).json({
      error: "csrf validation error",
    });
  } else {
    next(error);
  }
};

// Store the CSRF token in the request object
const setAuthTokenForCsrf = (req: any, token: string | undefined) => {
  req.secretForCsrf = token;
}

// Retrieve the CSRF token from the request object
const getAuthTokenForCsrf = (req: any) => {
  return req.secretForCsrf ?? getTokenFromRequest(req);
}

// Add CSRF token to the response
const addCsrfToken = (req: any, res: any, authToken: string | undefined) => {
  setAuthTokenForCsrf(req, authToken);
  const csrfToken = generateToken(req, res, true);
  return csrfToken;
}

const removeCsrfToken = (req: any, res: any) => {
  setAuthTokenForCsrf(req, undefined);
  res.clearCookie(CSRF_COOKIE_NAME, COOKIE_OPTIONS);
}


export { doubleCsrfProtection, csrfErrorHandler, generateToken, addCsrfToken, removeCsrfToken };