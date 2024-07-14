// These settings are only for local development testing.
// Do not use these in production.

import { doubleCsrf } from "csrf-csrf";

const CSRF_SECRET = "super csrf secret";
const CSRF_COOKIE_NAME = "x-csrf-token";

// In production, ensure you're using cors and helmet and have proper configuration.
const { invalidCsrfTokenError, generateToken, doubleCsrfProtection } =
  doubleCsrf({
    getSecret: () => CSRF_SECRET,
    cookieName: CSRF_COOKIE_NAME,
    cookieOptions: { sameSite: true, secure: false }, // not ideal for production, development only
  });

// Error handling, validation error interception
const csrfErrorHandler = (error: any, req: any, res: any, next: any) => {
  if (error == invalidCsrfTokenError) {
    res.status(403).json({
      error: "csrf validation error",
    });
  } else {
    next();
  }
};

export { doubleCsrfProtection, csrfErrorHandler, generateToken };