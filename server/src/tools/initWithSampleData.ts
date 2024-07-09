import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User, { IUser } from '../models/User'; // Adjust path as per your setup
import Stage, { IStage, StageType } from '../models/Stage'; // Adjust path as per your setup
import Application, { IApplication } from '../models/Application'; // Adjust path as per your setup

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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
async function eraseAllData() {
  try {
    await User.deleteMany({});
    await Stage.deleteMany({});
    await Application.deleteMany({});
    console.log('All data erased successfully');
  } catch (error) {
    console.error('Failed to erase data:', error);
  }
}

// Function to create a single user
async function createSampleUser(): Promise<mongoose.Types.ObjectId> {
  try {
    const userData: Partial<IUser> = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    };
    const newUser = new User(userData);
    await newUser.save();
    console.log('User created successfully');
    return newUser._id as mongoose.Types.ObjectId;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

// Function to create sample stages
async function createSampleStages(): Promise<mongoose.Types.ObjectId[]> {
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

// Function to create sample job applications
async function createSampleApplications(userId: mongoose.Types.ObjectId, stageIds: mongoose.Types.ObjectId[]): Promise<void> {
  try {
    const sampleApplicationsData: Partial<IApplication>[] = [
        {
          company: 'Tech Solutions Inc.',
          role: 'Software Engineer',
          url: 'https://techsolutionsinc.com/careers/software-engineer',
          location: 'San Francisco, CA',
          salary: 120000,
          stage: stageIds[0], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 5
        },
        {
          company: 'DesignHub',
          role: 'UX Designer',
          url: 'https://designhub.com/careers/ux-designer',
          location: 'New York, NY',
          salary: 100000,
          stage: stageIds[1], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 5
        },
        {
          company: 'Tech World Innovations',
          role: 'Product Designer',
          url: 'https://techworldinnovations.com/careers/product-designer',
          location: 'Seattle, WA',
          salary: 100000,
          stage: stageIds[2], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 5
        },
        {
          company: 'Cloud Services Co.',
          role: 'Software Engineer',
          url: 'https://cloudservicesco.com/careers/software-engineer',
          location: 'Austin, TX',
          salary: 110000,
          stage: stageIds[3], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 5
        },
        {
          company: 'Creative Designs Ltd.',
          role: 'UX Designer',
          url: 'https://creativedesignsltd.com/careers/ux-designer',
          location: 'Los Angeles, CA',
          salary: 100000,
          stage: stageIds[4], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 5
        },
        {
          company: 'Innovate Now Solutions',
          role: 'Product Designer',
          url: 'https://innovatenowsolutions.com/careers/product-designer',
          location: 'Chicago, IL',
          salary: 100000,
          stage: stageIds[11], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 5
        },
        {
          company: 'Code Masters Inc.',
          role: 'Software Engineer',
          url: 'https://codemastersinc.com/careers/software-engineer',
          location: 'Boston, MA',
          salary: 115000,
          stage: stageIds[6], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 4
        },
        {
          company: 'Digital Solutions Group',
          role: 'UX Designer',
          url: 'https://digitalsolutionsgroup.com/careers/ux-designer',
          location: 'San Diego, CA',
          salary: 100000,
          stage: stageIds[12], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 4
        },
        {
          company: 'Future Tech Innovations',
          role: 'Product Designer',
          url: 'https://futuretechinnovations.com/careers/product-designer',
          location: 'Denver, CO',
          salary: 100000,
          stage: stageIds[13], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 4
        },
        {
          company: 'Tech Start Innovations',
          role: 'Software Engineer',
          url: 'https://techstartinnovations.com/careers/software-engineer',
          location: 'Portland, OR',
          salary: 105000,
          stage: stageIds[15], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 4
        },
        {
          company: 'Digital Design Co.',
          role: 'UX Designer',
          url: 'https://digitaldesignco.com/careers/ux-designer',
          location: 'Miami, FL',
          salary: 100000,
          stage: stageIds[0], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 4
        },
        {
          company: 'Innovative Solutions Ltd.',
          role: 'Product Designer',
          url: 'https://innovativesolutionsltd.com/careers/product-designer',
          location: 'Atlanta, GA',
          salary: 100000,
          stage: stageIds[1], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 4
        },
        {
          company: 'Data Tech Systems',
          role: 'Software Engineer',
          url: 'https://datatechsystems.com/careers/software-engineer',
          location: 'Houston, TX',
          salary: 100000,
          stage: stageIds[2], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 4
        },
        {
          company: 'User Experience Co.',
          role: 'UX Designer',
          url: 'https://userexperienceco.com/careers/ux-designer',
          location: 'Seattle, WA',
          salary: 100000,
          stage: stageIds[14], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 4
        },
        {
          company: 'Design Innovations Group',
          role: 'Product Designer',
          url: 'https://designinnovationsgroup.com/careers/product-designer',
          location: 'Dallas, TX',
          salary: 100000,
          stage: stageIds[4], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 4
        },
        {
          company: 'Tech Solutions Now',
          role: 'Software Engineer',
          url: 'https://techsolutionsnow.com/careers/software-engineer',
          location: 'San Francisco, CA',
          salary: 125000,
          stage: stageIds[5], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 4
        },
        {
          company: 'Creative Designs Co.',
          role: 'UX Designer',
          url: 'https://creativedesignsco.com/careers/ux-designer',
          location: 'New York, NY',
          salary: 100000,
          stage: stageIds[6], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 4
        },
        {
          company: 'Innovation Hub Ltd.',
          role: 'Product Designer',
          url: 'https://innovationhubltd.com/careers/product-designer',
          location: 'Los Angeles, CA',
          salary: 100000,
          stage: stageIds[7], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 4
        },
        {
          company: 'Code Innovations Inc.',
          role: 'Software Engineer',
          url: 'https://codeinnovationsinc.com/careers/software-engineer',
          location: 'Boston, MA',
          salary: 110000,
          stage: stageIds[8], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 4
        },
        {
          company: 'Digital Design Hub',
          role: 'UX Designer',
          url: 'https://digitaldesignhub.com/careers/ux-designer',
          location: 'Chicago, IL',
          salary: 100000,
          stage: stageIds[9], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId,
          rank: 2
        },
      ]      

    for (const applicationData of sampleApplicationsData) {
      const newApplication = new Application(applicationData);
      await newApplication.save();
    }

    console.log('Sample applications created successfully');
  } catch (error) {
    console.error('Failed to create sample applications:', error);
    throw error;
  }
}

// Main function to orchestrate the script
async function main() {
  await connectToDatabase();
  await eraseAllData();
  
  const userId = await createSampleUser();
  const stageIds = await createSampleStages();
  await createSampleApplications(userId, stageIds);
  
  mongoose.disconnect(); // Disconnect from MongoDB after operations are complete
}

// Run the main function to execute the script
main();
