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
  selectedApplication: Application | null;
  filter: ApplicationsFilter;
  filterData: FilterData;
  editorMode: 'closed' | 'view' | 'edit' | 'add';
  status: 'idle' | 'loading' | 'failed';
  error: string | undefined | null;
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
      applyFilter(state, action);
    },
    setSelectedApplication(state, action: PayloadAction<Application>) {
      state.selectedApplication = action.payload;
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
        applyFilter(state, { payload: state.filter, type: '' });
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addApplication.fulfilled, (state, action: PayloadAction<Application>) => {
        state.applications.push(action.payload);
        state.error = '';
        applyFilter(state, { payload: state.filter, type: '' });
      })
      .addCase(updateApplication.fulfilled, (state, action: PayloadAction<Application>) => {
        const index = state.applications.findIndex(app => app._id === action.payload._id);
        if (index !== -1) {
            state.applications[index] = action.payload;
            state.error = '';
            applyFilter(state, { payload: state.filter, type: '' });
        }
      })
      .addCase(deleteApplication.fulfilled, (state, action: PayloadAction<string>) => {
        state.applications = state.applications.filter(app => app._id !== action.payload);
        applyFilter(state, { payload: state.filter, type: '' });
        state.error = '';
      });
  },
});

// Export actions
export const {
  filterApplications,
  resetFilter,
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

const parseSalary = (salary: string | undefined) => {
  if (!salary) return 0;

  // Remove non-numeric characters except for range indicators
  const cleaned = salary.replace(/[^\d\-.kK]/g, '');

  // Split ranges
  const parts = cleaned.split(/[-–]/).map(part => part.trim());

  // Convert parts to numbers
  const values = parts.map(part => {
      if (part.toLowerCase().includes('k')) {
          return parseFloat(part) * 1000;
      }
      return parseFloat(part);
  });

  // Return the average if range, otherwise the single value
  if (values.length === 2) {
      return (values[0] + values[1]) / 2;
  }

  return values[0] || 0;
};


// Helper function to apply filter
function applyFilter(state: ApplicationState, action: { payload: Partial<ApplicationsFilter>; type: string; }) {
  const filter = state.filter;
  const filterStages = filter.stage.map(stage => stage._id);
  state.filteredApplications = state.applications.filter(application => {
    const matchesSearch = filter.search
      ? (
        application.company.toLowerCase().includes(filter.search.toLowerCase()) ||
        application.role.toLowerCase().includes(filter.search.toLowerCase())
      )
      : true;
    const matchesLocation = filter.location.length ? filter.location.includes(application.location) : true;
    const matchesStage = filter.stage.length ? filterStages.includes(application.stage._id) : true;
    const matchesRank = filter.rank.length ? filter.rank.includes(application.rank) : true;
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
          const aSalary = parseSalary(a.salary);
          const bSalary = parseSalary(b.salary);
          return bSalary - aSalary;
      } else if (action.payload.sort === 'rank') {
        return a.rank - b.rank;
      } else if (action.payload.sort === 'date') {
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(); 
      } 
      return 0;
    });
  }
}

