import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User, { IUser } from '../models/User'; // Adjust path as per your setup
import Stage, { IStage } from '../models/Stage'; // Adjust path as per your setup
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
      { name: 'Applied', number: 1 },
      { name: 'Phone Interview', number: 2 },
      { name: 'Onsite Interview', number: 3 },
      { name: 'Offer', number: 4 },
      { name: 'Rejected', number: 5 },
      { name: 'Final Interview', number: 6 },
      { name: 'Assessment Test', number: 7 },
      { name: 'Technical Interview', number: 8 },
      { name: 'Background Check', number: 9 },
      { name: 'Contract Signing', number: 10 }
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
          user: userId
        },
        {
          company: 'DesignHub',
          role: 'UX Designer',
          url: 'https://designhub.com/careers/ux-designer',
          location: 'New York, NY',
          stage: stageIds[1], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId
        },
        {
          company: 'Tech World Innovations',
          role: 'Product Designer',
          url: 'https://techworldinnovations.com/careers/product-designer',
          location: 'Seattle, WA',
          stage: stageIds[2], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId
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
          user: userId
        },
        {
          company: 'Creative Designs Ltd.',
          role: 'UX Designer',
          url: 'https://creativedesignsltd.com/careers/ux-designer',
          location: 'Los Angeles, CA',
          stage: stageIds[4], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId
        },
        {
          company: 'Innovate Now Solutions',
          role: 'Product Designer',
          url: 'https://innovatenowsolutions.com/careers/product-designer',
          location: 'Chicago, IL',
          stage: stageIds[5], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId
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
          user: userId
        },
        {
          company: 'Digital Solutions Group',
          role: 'UX Designer',
          url: 'https://digitalsolutionsgroup.com/careers/ux-designer',
          location: 'San Diego, CA',
          stage: stageIds[7], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId
        },
        {
          company: 'Future Tech Innovations',
          role: 'Product Designer',
          url: 'https://futuretechinnovations.com/careers/product-designer',
          location: 'Denver, CO',
          stage: stageIds[8], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId
        },
        {
          company: 'Tech Start Innovations',
          role: 'Software Engineer',
          url: 'https://techstartinnovations.com/careers/software-engineer',
          location: 'Portland, OR',
          salary: 105000,
          stage: stageIds[9], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId
        },
        {
          company: 'Digital Design Co.',
          role: 'UX Designer',
          url: 'https://digitaldesignco.com/careers/ux-designer',
          location: 'Miami, FL',
          stage: stageIds[0], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId
        },
        {
          company: 'Innovative Solutions Ltd.',
          role: 'Product Designer',
          url: 'https://innovativesolutionsltd.com/careers/product-designer',
          location: 'Atlanta, GA',
          stage: stageIds[1], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId
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
          user: userId
        },
        {
          company: 'User Experience Co.',
          role: 'UX Designer',
          url: 'https://userexperienceco.com/careers/ux-designer',
          location: 'Seattle, WA',
          stage: stageIds[3], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId
        },
        {
          company: 'Design Innovations Group',
          role: 'Product Designer',
          url: 'https://designinnovationsgroup.com/careers/product-designer',
          location: 'Dallas, TX',
          stage: stageIds[4], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId
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
          user: userId
        },
        {
          company: 'Creative Designs Co.',
          role: 'UX Designer',
          url: 'https://creativedesignsco.com/careers/ux-designer',
          location: 'New York, NY',
          stage: stageIds[6], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId
        },
        {
          company: 'Innovation Hub Ltd.',
          role: 'Product Designer',
          url: 'https://innovationhubltd.com/careers/product-designer',
          location: 'Los Angeles, CA',
          stage: stageIds[7], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId
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
          user: userId
        },
        {
          company: 'Digital Design Hub',
          role: 'UX Designer',
          url: 'https://digitaldesignhub.com/careers/ux-designer',
          location: 'Chicago, IL',
          stage: stageIds[9], 
          dateCreated: new Date(),
          dateModified: new Date(),
          dateApplied: new Date(),
          user: userId
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
