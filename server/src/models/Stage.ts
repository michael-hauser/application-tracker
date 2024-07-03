import { Schema, model, Document } from 'mongoose';

// Interface for Stage document
export interface IStage extends Document {
    name: string;
    number: number;
}

// Define schema for Stage
const StageSchema = new Schema({
    name: { type: String, required: true },
    number: { type: Number, required: true }
});

// Create and export Stage model
export default model<IStage>('Stage', StageSchema);
