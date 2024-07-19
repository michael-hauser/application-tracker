import { doubleCsrf } from "csrf-csrf";
import { getTokenFromRequest } from "./auth";

const CSRF_COOKIE_NAME = "x-csrf-token";

const COOKIE_OPTIONS = {
  sameSite: true,
  secure: false,
};
  
if(process.env.NODE_ENV === "production") {
  COOKIE_OPTIONS.secure = true;
}

// In production, ensure you're using cors and helmet and have proper configuration.
const { invalidCsrfTokenError, generateToken, doubleCsrfProtection } =
  doubleCsrf({
    getSecret: (req: any) => {
      const sessionId = req.sessionID;
      return `${sessionId}${process.env.CSRF_SECRET}`; // Tie the CSRF token to the user's session
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

export { doubleCsrfProtection, csrfErrorHandler, generateToken };