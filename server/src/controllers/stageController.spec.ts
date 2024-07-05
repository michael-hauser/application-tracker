const mockingoose = require("mockingoose");
import {
  getAllStages,
  getStageById,
  createStage,
  updateStage,
  deleteStage
} from './stageController';
import Stage, { IStage } from '../models/Stage';

// Mock Stage model methods
mockingoose(Stage);

// Define a mocked stage data
const mockStageData: Partial<IStage> = {
  name: 'Stage 1',
  number: 1
};

describe('StageController', () => {
  describe('getAllStages', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return all stages', async () => {
      const stages = [
        { _id: 'mockedId1', name: 'Stage 1', number: 1 },
        { _id: 'mockedId2', name: 'Stage 2', number: 2 }
      ];

      mockingoose(Stage).toReturn(stages, 'find');

      const result = await getAllStages();
      result.forEach((stageX, index) => {
        expect(stageX._id).toBeDefined();
        expect(stageX.name).toEqual(stages[index].name);
        expect(stageX.number).toEqual(stages[index].number);
      });
    });

    it('should handle errors', async () => {
      mockingoose(Stage).toReturn(new Error('Database error'), 'find');

      await expect(getAllStages()).rejects.toThrow('Failed to fetch stages');
    });
  });

  describe('getStageById', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return a stage by ID', async () => {
      const stageId = 'mockedId';

      mockingoose(Stage).toReturn(mockStageData, 'findOne');

      const result = await getStageById(stageId);
      expect(result?.name).toEqual(mockStageData.name);
      expect(result?.number).toEqual(mockStageData.number);
    });

    it('should handle errors', async () => {
      const stageId = 'mockedId';

      mockingoose(Stage).toReturn(new Error('Database error'), 'findOne');

      await expect(getStageById(stageId)).rejects.toThrow('Failed to fetch stage');
    });
  });

  describe('createStage', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should create a new stage', async () => {
      const savedStage = { _id: 'newStageId', ...mockStageData };

      mockingoose(Stage).toReturn(savedStage, 'save');

      const result = await createStage(mockStageData);
      expect(result.name).toEqual(savedStage.name);
      expect(result.number).toEqual(savedStage.number);
    });

    it('should handle errors', async () => {
      mockingoose(Stage).toReturn(new Error('Database error'), 'save');

      await expect(createStage(mockStageData)).rejects.toThrow('Failed to create stage');
    });
  });

  describe('updateStage', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should update an existing stage', async () => {
      const stageId = 'mockedId';
      const updatedData: Partial<IStage> = { name: 'Updated Stage' };
      const updatedStage = { _id: stageId, ...mockStageData, ...updatedData };

      mockingoose(Stage).toReturn(updatedStage, 'findOneAndUpdate');

      const result = await updateStage(stageId, updatedData);
      expect(result?.name).toEqual(updatedStage.name);
      expect(result?.number).toEqual(updatedStage.number);
    });

    it('should handle errors', async () => {
      const stageId = 'mockedId';
      const updatedData: Partial<IStage> = { name: 'Updated Stage' };

      mockingoose(Stage).toReturn(new Error('Database error'), 'findOneAndUpdate');

      await expect(updateStage(stageId, updatedData)).rejects.toThrow('Failed to update stage');
    });
  });

  describe('deleteStage', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should delete an existing stage', async () => {
      const stageId = 'mockedId';

      mockingoose(Stage).toReturn({ _id: stageId }, 'findOneAndDelete');

      const result = await deleteStage(stageId);
      expect(result).toEqual('Stage removed');
    });

    it('should handle errors', async () => {
      const stageId = 'mockedId';

      mockingoose(Stage).toReturn(new Error('Database error'), 'findOneAndDelete');

      await expect(deleteStage(stageId)).rejects.toThrow('Failed to delete stage');
    });
  });
});
