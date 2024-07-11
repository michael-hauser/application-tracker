import Application, { IApplication } from '../models/Application';

/**
 * @description Fetch all applications for a user
 * @param userId User ID to fetch applications for
 * @returns Promise resolving to array of applications
 */
export const getAllApplications = async (userId: string): Promise<IApplication[]> => {
    try {
        const applications = await Application.find({ user: userId }).populate('stage');
        return applications;
    } catch (err: any) {
        console.error('Error fetching applications:', err.message);
        throw new Error('Failed to fetch applications');
    }
};

/**
 * @description Fetch single application by ID
 * @param applicationId Application ID to fetch
 * @param userId User ID to verify ownership
 * @returns Promise resolving to application object
 */
export const getApplicationById = async (applicationId: string, userId: string): Promise<IApplication | null> => {
    try {
        const application = await Application.findById(applicationId).populate('stage');
        if (!application) {
            throw new Error('Application not found');
        }
        // Check if user owns application
        if (application.user.toString() !== userId) {
            throw new Error('User not authorized');
        }
        return application;
    } catch (err: any) {
        console.error('Error fetching application:', err.message);
        throw new Error('Failed to fetch application');
    }
};

/**
 * @description Create a new application
 * @param applicationData Data object for new application
 * @returns Promise resolving to created application object
 */
export const createApplication = async (applicationData: Partial<IApplication>): Promise<IApplication | null> => {
    try {
        const newApplication = new Application(applicationData);
        const application = await newApplication.save();
        const savedApplication = await Application.findById(application._id).populate('stage');
        return savedApplication;
    } catch (err: any) {
        console.error('Error creating application:', err.message);
        throw new Error('Failed to create application');
    }
};

/**
 * @description Update an existing application
 * @param applicationId Application ID to update
 * @param applicationData Updated data object for application
 * @param userId User ID to verify ownership
 * @returns Promise resolving to updated application object
 */
export const updateApplication = async (
    applicationId: string,
    applicationData: Partial<IApplication>,
    userId: string
): Promise<IApplication | null> => {
    try {
        let application = await Application.findById(applicationId);

        if (!application) {
            throw new Error('Application not found');
        }

        // Check if user owns application
        if (application.user.toString() !== userId) {
            throw new Error('User not authorized');
        }

        // Update fields
        Object.assign(application, applicationData);
        application.dateModified = new Date();

        application = await application.save();
        application = await Application.findById(application._id).populate('stage');

        return application;
    } catch (err: any) {
        console.error('Error updating application:', err.message);
        throw new Error('Failed to update application');
    }
};

/**
 * @description Delete an application
 * @param applicationId Application ID to delete
 * @param userId User ID to verify ownership
 * @returns Promise resolving to success message
 */
export const deleteApplication = async (applicationId: string, userId: string): Promise<string> => {
    try {
        let application = await Application.findById(applicationId);

        if (!application) {
            throw new Error('Application not found');
        }

        // Check if user owns application
        if (application.user.toString() !== userId) {
            throw new Error('User not authorized');
        }

        await Application.findByIdAndDelete(applicationId);
        return 'Application removed';
    } catch (err: any) {
        console.error('Error deleting application:', err.message);
        throw new Error('Failed to delete application');
    }
};
