import mongoose, { Schema, Document, Model, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Interface representing a User document.
 */
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    admin: boolean;
    tokens: { token: string }[];
}

/**
 * Interface representing methods available on User instances.
 */
export interface IUserMethods {
    /**
     * Generates an authentication token for the user.
     * @returns A promise that resolves with the generated token.
     */
    generateAuthToken(): Promise<string>;
    
    /**
     * Converts the user instance to a JSON object, omitting sensitive fields.
     * @returns A JSON object representing the user.
     */
    toJSON(): IUser;
}

/**
 * Interface representing the User model with static methods.
 */
interface UserModel extends Model<IUser, {}, IUserMethods> {
    /**
     * Finds a user by their credentials (email and password).
     * @param email - The user's email address.
     * @param password - The user's password.
     * @returns A promise that resolves with the user document, if found.
     */
    findByCredentials(email: string, password: string): Promise<HydratedDocument<IUser, IUserMethods>>;
}

/**
 * Schema for User
 */
const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false }
});

/**
 * Hash password before saving
 */
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

/**
 * Generates an authentication token for the user.
 * @returns A promise that resolves with the generated token.
 */
userSchema.methods.generateAuthToken = async function () {
    const user = this as IUser;
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

/**
 * Converts the user instance to a JSON object, omitting sensitive fields.
 * @returns A JSON object representing the user.
 */
userSchema.methods.toJSON = function () {
    const user = this as IUser;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};

/**
 * Finds a user by their credentials (email and password).
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves with the user document, if found.
 */
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
