import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchUserProfileAPI, loginUserAPI, looutUserAPI, registerUserAPI } from '../../services/userService';
import { saveAuthToken, removeAuthToken, isAuthenticated, getCsrfToken } from '../../utils/auth';
import { IAuthModel, IUser } from '../../models/User.model';
import createCustomAsyncThunk from '../../utils/createCustomAsyncThunk';

interface UserState {
  user: IUser | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | undefined | null;
}

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null
};

export const loginUser = createCustomAsyncThunk(
  'user/loginUser',
  async (credentials: { email: string; password: string }) => {
    await getCsrfToken();
    const response = await loginUserAPI(credentials);
    return response.data;
  }
);

export const registerUser = createCustomAsyncThunk(
  'user/registerUser',
  async (user: { name: string; email: string; password: string; }) => {
    await getCsrfToken();
    const response = await registerUserAPI(user);
    return response.data;
  },
);

export const logoutUser = createCustomAsyncThunk(
  'user/logoutUser',
  async () => {
    const response = await looutUserAPI();
    return response.data;
  }
);

export const fetchUserDetails = createCustomAsyncThunk(
  'user/fetchUserDetails',
  async () => {
    try {
      const response = await fetchUserProfileAPI();
      return response.data; 
    } catch (error) {
      throw new Error('Failed to fetch user details');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<IAuthModel>) => {
        if(!action.payload.user || !action.payload.token) return;
        state.status = 'idle';
        state.user = action.payload.user;
        state.error = '';
        saveAuthToken(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<IAuthModel>) => {
        if(!action.payload.user || !action.payload.token) return;
        state.status = 'idle';
        state.user = action.payload.user;
        state.error = '';
        saveAuthToken(action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(logoutUser.pending, (state, action: any) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
        removeAuthToken();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch user details';
        removeAuthToken();
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.status = 'idle';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = null;
        if(isAuthenticated()) removeAuthToken();
      });
  },
});

export const selectUser = (state: RootState) => state.user.user;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
