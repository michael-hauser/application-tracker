import { Request } from 'express';
import { IUser } from '../src/models/User'; // Adjust the path based on your user model definition

declare module 'express' {
    interface Request {
        user?: IUser; // Adjust the type based on your user model
    }
}