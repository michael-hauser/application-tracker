import { Schema, model, Types, Document } from 'mongoose';

// Interface for Application document
export interface IApplication extends Document {
    company: string;
    role: string;
    url: string;
    location: string;
    salary?: string;
    stage: Types.ObjectId; 
    rank: number;
    dateCreated: Date;
    dateModified: Date;
    dateApplied?: Date;
    user: Types.ObjectId;
    comments?: string;
}

// Define schema for Application
const ApplicationSchema = new Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    url: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String },
    stage: { type: Types.ObjectId, ref: 'Stage', required: true },
    rank: { type: Number },
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
    dateApplied: { type: Date },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    comments: { type: String }
});

// Create and export Application model
export default model<IApplication>('Application', ApplicationSchema);
