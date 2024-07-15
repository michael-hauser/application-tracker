import express from 'express';
import session from 'express-session';

export const getSessionConfig = (app: express.Express) => {
    const secret = process.env.SESSION_SECRET;
    if(!secret) throw new Error('Session secret is not set');

    const dev: session.SessionOptions = {
        secret: secret,
        cookie: {
            secure: false,
        }
    }

    const prod: session.SessionOptions = {
        ...dev,
        cookie: {
            secure: true,
        }
    }


    if (process.env.ENV === 'prod') {
        app.set('trust proxy', 1) // trust first proxy
        return prod;
    } else {
        return dev;
    }
}