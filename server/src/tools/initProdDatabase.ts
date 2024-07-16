import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User, { IUser } from '../models/User'; // Adjust path as per your setup
import Stage, { IStage, StageType } from '../models/Stage'; // Adjust path as per your setup
import Application, { IApplication } from '../models/Application'; // Adjust path as per your setup

// dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGO_URI!;

// Define a function to connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Function to erase all data
async function eraseData() {
  try {
    await Stage.deleteMany({});
    console.log('All data erased successfully');
  } catch (error) {
    console.error('Failed to erase data:', error);
  }
}


// Function to create sample stages
async function createStages(): Promise<mongoose.Types.ObjectId[]> {
  try {
    const sampleStagesData: Partial<IStage>[] = [
      { name: 'Idea', type: StageType.Init, number: 1 },
      { name: 'Ready to apply', type: StageType.Init, number: 2 },
      { name: 'Applied', type: StageType.Active1, number: 10 },
      { name: 'Messaged Employee', type: StageType.Active1, number: 11 },
      { name: 'Messaged Recruiter', type: StageType.Active1, number: 12 },
      { name: 'Followed up 1', type: StageType.Active1, number: 13 },
      { name: 'Followed up 2', type: StageType.Active1, number: 14 },
      { name: 'Followed up 3', type: StageType.Active1, number: 15 },
      { name: 'Interview 1', type: StageType.Active2, number: 20 },
      { name: 'Interview 2', type: StageType.Active2, number: 21 },
      { name: 'Interview 3', type: StageType.Active2, number: 22 },
      { name: 'Interview 4', type: StageType.Active2, number: 23 },
      { name: 'Rejected & Interested', type: StageType.Pause, number: 30 },
      { name: 'Rejected', type: StageType.Fail, number: 31 },
      { name: `Don't like`, type: StageType.Fail, number: 32 },
      { name: `Offered`, type: StageType.Success, number: 33 },
      { name: `Signed`, type: StageType.Success, number: 34 },
  ];

    const createdStages: mongoose.Types.ObjectId[] = [];
    for (const stageData of sampleStagesData) {
      const newStage = new Stage(stageData);
      await newStage.save();
      createdStages.push(newStage.id);
    }

    console.log('Sample stages created successfully');
    return createdStages;
  } catch (error) {
    console.error('Failed to create sample stages:', error);
    throw error;
  }
}

// Main function to orchestrate the script
async function main() {
  await connectToDatabase();
  await eraseData();
  await createStages();
  
  mongoose.disconnect(); // Disconnect from MongoDB after operations are complete
}

// Run the main function to execute the script
main();
