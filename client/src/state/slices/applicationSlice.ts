import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import { fetchApplicationsAPI, addApplicationAPI, updateApplicationAPI, deleteApplicationAPI } from '../../services/applicationService';
import { Application } from '../../models/Application.model';
import createCustomAsyncThunk from '../../utils/createCustomAsyncThunk';
import { Stage } from '../../models/Stage.model';

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

interface ApplicationState {
  applications: Application[];
  filteredApplications: Application[];
  filter: ApplicationsFilter;
  filterData: FilterData;
  status: 'idle' | 'loading' | 'failed';
  error: string | undefined | null;
}

const DEFAULT_FILTER: ApplicationsFilter = {
  search: '',
  location: [],
  stage: [],
  rank: [],
  sort: SortOptions.none
};

const initialState: ApplicationState = {
  applications: [],
  filteredApplications: [],
  filter: DEFAULT_FILTER,
  filterData: {
    locations: [],
    stages: [],
    ranks: []
  },
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

      // Filtering
      const f = state.filter;
      const fStages = f.stage.map(stage => stage._id);
      state.filteredApplications = state.applications.filter(application => {
        const matchesSearch = f.search
          ? (
            application.company.toLowerCase().includes(f.search.toLowerCase()) ||
            application.role.toLowerCase().includes(f.search.toLowerCase())
          )
          : true;
        const matchesLocation = f.location.length ? f.location.includes(application.location) : true;
        const matchesStage = f.stage.length ? fStages.includes(application.stage._id) : true;
        const matchesRank = f.rank.length ? f.rank.includes(application.rank) : true;
        return matchesSearch && matchesLocation && matchesStage && matchesRank;
      });

      // Sorting
      if (action.payload.sort) {
        state.filteredApplications.sort((a, b) => {
          if (action.payload.sort === 'company') {
            return a.company.localeCompare(b.company);
          } else if (action.payload.sort === 'role') {
            return a.role.localeCompare(b.role);
          } else if (action.payload.sort === 'url') {
            return a.url.localeCompare(b.url);
          } else if (action.payload.sort === 'location') {
            return a.location.localeCompare(b.location);
          } else if (action.payload.sort === 'stage') {
            return a.stage.name.localeCompare(b.stage.name);
          } else if (action.payload.sort === 'salary') {
            return (a.salary !== undefined && b.salary !== undefined) ? a.salary - b.salary : 0;
          } else if (action.payload.sort === 'rank') {
            return a.rank - b.rank;
          }
          return 0;
        });
      }
    }
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
        state.filterData.stages = Array.from(new Map(action.payload.map(app => [app.stage._id, app.stage])).values()).sort((a, b) => a.number - b.number);
        state.filterData.ranks = [1, 2, 3, 4, 5];
        state.filter = DEFAULT_FILTER;
        state.filteredApplications = state.applications;
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
        const index = state.applications.findIndex(app => app._id === action.payload._id);
        if (index >= 0) {
          state.applications[index] = action.payload;
        }
        state.error = '';
      })
      .addCase(deleteApplication.fulfilled, (state, action: PayloadAction<string>) => {
        state.applications = state.applications.filter(app => app._id !== action.payload);
        state.error = '';
      });
  },
});

// Export actions
export const { filterApplications, resetFilter } = applicationSlice.actions;

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
