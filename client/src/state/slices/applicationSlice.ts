import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import { fetchApplicationsAPI, addApplicationAPI, updateApplicationAPI, deleteApplicationAPI } from '../../services/applicationService';
import { Application } from '../../models/Application.model';
import createCustomAsyncThunk from '../../utils/createCustomAsyncThunk';
import { Stage } from '../../models/Stage.model';
import { applyApplicationsFilter } from './helpers/applyApplicationsFilter';
import { updateStatistics } from './helpers/updateStatistics';

export enum SortOptions {
  none = 'none',
  company = 'company',
  role = 'role',
  url = 'url',
  location = 'location',
  stage = 'stage',
  salary = 'salary',
  rank = 'rank',
  date = 'date'
}

export interface ApplicationsFilter {
  search: string;
  location: string[];
  stage: Stage[];
  rank: number[];
  sort: SortOptions;
}

export interface FilterData {
  locations: string[];
  stages: Stage[];
  ranks: number[];
}

export interface Statistics {
  totalApplications: number;
}

export interface ApplicationState {
  applications: Application[];
  filteredApplications: Application[];
  selectedApplication: Application | null;
  filter: ApplicationsFilter;
  filterData: FilterData;
  editorMode: 'closed' | 'view' | 'edit' | 'add';
  status: 'idle' | 'loading' | 'failed';
  error: string | undefined | null;
  statistics: Statistics;
}

const DEFAULT_FILTER: ApplicationsFilter = {
  search: '',
  location: [],
  stage: [],
  rank: [],
  sort: SortOptions.date
};

const initialState: ApplicationState = {
  applications: [],
  filteredApplications: [],
  selectedApplication: null,
  filter: DEFAULT_FILTER,
  filterData: {
    locations: [],
    stages: [],
    ranks: []
  },
  editorMode: 'closed',
  status: 'idle',
  error: null,
  statistics: {
    totalApplications: 0
  }
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

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    resetFilter: (state) => {
      state.filter = DEFAULT_FILTER;
      state.filteredApplications = state.applications;
    },
    filterApplications: (state, action: PayloadAction<Partial<ApplicationsFilter>>) => {
      state.filter = { ...state.filter, ...action.payload };
      state.filteredApplications = applyApplicationsFilter(state.filter, state.applications);
    },
    setSelectedApplication(state, action: PayloadAction<Application>) {
      state.selectedApplication = action.payload;
    },
    setFilterToStage(state, action: PayloadAction<Stage>) {
      state.filter = {
        ...state.filter,
        stage: action.payload ? [action.payload] : []
      };
      state.filteredApplications = applyApplicationsFilter(state.filter, state.applications);
    },
    openEditorEdit(state) {
      state.editorMode = 'edit';
    },
    openEditorAdd(state) {
      state.selectedApplication = null;
      state.editorMode = 'add';
    },
    closeEditor(state) {
      state.selectedApplication = null;
      state.editorMode = 'closed';
    },
  },
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

        // Initialize filter data
        state.filterData.locations = Array.from(new Set(action.payload.map(app => app.location))).sort();
        state.filterData.stages = Array.from(new Map(action.payload.map(app => [app.stage._id, app.stage])).values())
          .sort((a, b) => a.number - b.number);
        state.filterData.ranks = [1, 2, 3, 4, 5];
        state.filter = DEFAULT_FILTER;
        state.filteredApplications = applyApplicationsFilter(state.filter, state.applications);

        //Update Statistics
        state.statistics = updateStatistics(state);
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addApplication.fulfilled, (state, action: PayloadAction<Application>) => {
        state.applications.push(action.payload);
        state.error = '';
        state.filteredApplications = applyApplicationsFilter(state.filter, state.applications);

        //Update Statistics
        state.statistics = updateStatistics(state);
      })
      .addCase(updateApplication.fulfilled, (state, action: PayloadAction<Application>) => {
        const index = state.applications.findIndex(app => app._id === action.payload._id);
        if (index !== -1) {
            state.applications[index] = action.payload;
            state.error = '';
            state.filteredApplications = applyApplicationsFilter(state.filter, state.applications);

            //Update Statistics
            state.statistics = updateStatistics(state);
          }
      })
      .addCase(deleteApplication.fulfilled, (state, action: PayloadAction<string>) => {
        state.applications = state.applications.filter(app => app._id !== action.payload);
        state.filteredApplications = applyApplicationsFilter(state.filter, state.applications);
        state.error = '';

        //Update Statistics
        state.statistics = updateStatistics(state);
      });
  },
});

// Export actions
export const {
  filterApplications,
  resetFilter,
  setFilterToStage,
  setSelectedApplication,
  openEditorAdd,
  openEditorEdit,
  closeEditor
} = applicationSlice.actions;

// Selectors
export const selectApplications = (state: RootState) => state.application.applications;
export const filteredApplications = (state: RootState) => state.application.filteredApplications;
export const selectApplicationById = (state: RootState, applicationId: string) =>
  state.application.applications.find(app => app._id === applicationId);

// Async Thunk for conditionally dispatching actions based on current state
export const fetchApplicationsIfNeeded = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  if (state.application.status === 'idle') {
    dispatch(fetchApplications());
  }
};

export default applicationSlice.reducer;


