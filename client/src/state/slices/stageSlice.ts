import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchStagesAPI } from '../../services/stageService';

interface Stage {
  id: string;
  name: string;
  [key: string]: any;
}

interface StageState {
  stages: Stage[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: StageState = {
  stages: [],
  status: 'idle',
};

// Async Thunks
export const fetchStages = createAsyncThunk(
  'stage/fetchStages',
  async () => {
    const response = await fetchStagesAPI();
    return response.data;
  }
);

// Slice
export const stageSlice = createSlice({
  name: 'stage',
  initialState,
  reducers: {
    // Define any synchronous actions if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStages.fulfilled, (state, action: PayloadAction<Stage[]>) => {
        state.status = 'idle';
        state.stages = action.payload;
      })
      .addCase(fetchStages.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

// Selectors
export const selectStages = (state: RootState) => state.stage.stages;
export const selectStageStatus = (state: RootState) => state.stage.status;

// Export the reducer
export default stageSlice.reducer;
