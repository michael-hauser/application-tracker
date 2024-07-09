import { Schema, model, Document } from 'mongoose';

// The different types of stages
export enum StageType {
    Init = 'init',
    Active1 = 'active1',
    Active2 = 'active2',
    Pause = 'pause',
    Fail = 'fail',
    Success = 'success',
}

// Interface for Stage document
export interface IStage extends Document {
    name: string;
    type: StageType;
    number: number;
}

// Define schema for Stage
const StageSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    number: { type: Number, required: true }
});

// Create and export Stage model
export default model<IStage>('Stage', StageSchema);
