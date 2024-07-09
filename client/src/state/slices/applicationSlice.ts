import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import { fetchApplicationsAPI, addApplicationAPI, updateApplicationAPI, deleteApplicationAPI } from '../../services/applicationService';
import { Application } from '../../models/Application.model';
import createCustomAsyncThunk from '../../utils/createCustomAsyncThunk';

interface ApplicationState {
  applications: Application[];
  status: 'idle' | 'loading' | 'failed';
  error: string | undefined | null;
}

const initialState: ApplicationState = {
  applications: [],
  status: 'idle',
  error: null
};

// Async Thunks
export const fetchApplications = createCustomAsyncThunk(
  'application/fetchApplications',
  async () => {
    const response = await fetchApplicationsAPI();
    return response.data;
  }
);

export const addApplication = createCustomAsyncThunk(
  'application/addApplication',
  async (newApplication: Omit<Application, 'id'>) => {
    const response = await addApplicationAPI(newApplication);
    return response.data;
  }
);

export const updateApplication = createCustomAsyncThunk(
  'application/updateApplication',
  async (updatedApplication: Application) => {
    const response = await updateApplicationAPI(updatedApplication);
    return response.data;
  }
);

export const deleteApplication = createCustomAsyncThunk(
  'application/deleteApplication',
  async (applicationId: string) => {
    await deleteApplicationAPI(applicationId);
    return applicationId;
  }
);

// Slice
export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchApplications.fulfilled, (state, action: PayloadAction<Application[]>) => {
        state.status = 'idle';
        state.applications = action.payload;
        state.error = '';
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addApplication.fulfilled, (state, action: PayloadAction<Application>) => {
        state.applications.push(action.payload);
        state.error = '';
      })
      .addCase(updateApplication.fulfilled, (state, action: PayloadAction<Application>) => {
        const index = state.applications.findIndex(app => app.id === action.payload.id);
        if (index >= 0) {
          state.applications[index] = action.payload;
        }
        state.error = '';
      })
      .addCase(deleteApplication.fulfilled, (state, action: PayloadAction<string>) => {
        state.applications = state.applications.filter(app => app.id !== action.payload);
        state.error = '';
      });
  },
});

// Selectors
export const selectApplications = (state: RootState) => state.application.applications;
export const selectApplicationById = (state: RootState, applicationId: string) =>
  state.application.applications.find(app => app.id === applicationId);

// Async Thunk for conditionally dispatching actions based on current state
export const fetchApplicationsIfNeeded = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  if (state.application.status === 'idle') {
    dispatch(fetchApplications());
  }
};

export default applicationSlice.reducer;
