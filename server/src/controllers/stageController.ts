import Stage, { IStage } from '../models/Stage';

/**
 * @description Fetch all stages
 * @returns Promise resolving to array of stages
 */
export const getAllStages = async (): Promise<IStage[]> => {
    try {
        const stages = await Stage.find();
        return stages;
    } catch (err: any) {
        console.error('Error fetching stages:', err.message);
        throw new Error('Failed to fetch stages');
    }
};

/**
 * @description Fetch single stage by ID
 * @param stageId Stage ID to fetch
 * @returns Promise resolving to stage object
 */
export const getStageById = async (stageId: string): Promise<IStage | null> => {
    try {
        const stage = await Stage.findById(stageId);
        if (!stage) {
            throw new Error('Stage not found');
        }
        return stage;
    } catch (err: any) {
        console.error('Error fetching stage:', err.message);
        throw new Error('Failed to fetch stage');
    }
};

/**
 * @description Create a new stage
 * @param stageData Data object for new stage
 * @returns Promise resolving to created stage object
 */
export const createStage = async (stageData: Partial<IStage>): Promise<IStage> => {
    try {
        const newStage = new Stage(stageData);
        const stage = await newStage.save();
        return stage;
    } catch (err: any) {
        console.error('Error creating stage:', err.message);
        throw new Error('Failed to create stage');
    }
};

/**
 * @description Update an existing stage
 * @param stageId Stage ID to update
 * @param stageData Updated data object for stage
 * @returns Promise resolving to updated stage object
 */
export const updateStage = async (
    stageId: string,
    stageData: Partial<IStage>
): Promise<IStage | null> => {
    try {
        let stage = await Stage.findByIdAndUpdate(stageId, stageData, { new: true });
        if (!stage) {
            throw new Error('Stage not found');
        }
        return stage;
    } catch (err: any) {
        console.error('Error updating stage:', err.message);
        throw new Error('Failed to update stage');
    }
};

/**
 * @description Delete a stage
 * @param stageId Stage ID to delete
 * @returns Promise resolving to success message
 */
export const deleteStage = async (stageId: string): Promise<string> => {
    try {
        let stage = await Stage.findByIdAndDelete(stageId);
        if (!stage) {
            throw new Error('Stage not found');
        }
        return 'Stage removed';
    } catch (err: any) {
        console.error('Error deleting stage:', err.message);
        throw new Error('Failed to delete stage');
    }
};
